<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align="center">
        <div v-if="!isDataFetched">
          Fetching Data
          <span class="ml-2"> <font-awesome-icon :icon="['fas', 'spinner']" pulse /> </span>
        </div>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col id="canvasContainer" align="center" />
    </v-row>
    <v-row align="center" justify="center">
      <v-col align="center">
        <div v-if="selectedCountry !== undefined">
          <span>{{ selectedCountry.properties.name }}</span>
          <span v-if="selectedCountry.properties.count !== undefined">: {{ selectedCountry.properties.count }}</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

export default {
  data () {
    return {
      worldDataURL: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
      covidDataURLs: {
        latestConfirmed: 'https://covid-athenaeum.herokuapp.com/api/countries/confirmed?onlyLatest=true',
        global: 'https://covid-athenaeum.herokuapp.com/api/global'
      },
      isDataFetched: false,

      world: undefined,
      worldLand: undefined,
      worldCountries: undefined,
      covidConfirmed: undefined,
      covidGlobal: undefined,
      countryToCount: {},
      minCount: undefined,
      maxCount: undefined,

      canvas: undefined,
      context: undefined,
      equirectangularCanvas: undefined,
      equirectangularContext: undefined,
      colorToCountry: {},
      isMounted: false,

      dimensions: {
        screenWidth: undefined,
        screenHeight: undefined,
        canvasSquareSide: undefined,
        canvasMargin: 50
      },

      scale: undefined,

      rotations: {
        yaw: 0,
        pitch: -10,
        roll: 0
      },

      colors: {
        landRed: '225',
        unavailableCountry: '#8F8D8D',
        selectedCountry: '#F2E4E4',
        water: '#5CA8BF'
      },

      autoRotationDegPerSec: 5,
      isRotating: false,

      drawLoop: undefined,
      lastDrawLoopCallTime: undefined,
      isBeingDrawn: false,

      selectedCountry: undefined,
      lastPinchDistance: undefined,
      dragSensitivity: 75,
      pinchZoomSensitivity: 0.08,
      isBeingDragged: false,

      nextUniqueColorSeed: 1
    }
  },

  computed: {
    width: {
      get () {
        return this.dimensions.canvasSquareSide
      }
    },

    height: {
      get () {
        return this.dimensions.canvasSquareSide
      }
    },

    radius: {
      get () {
        return this.dimensions.canvasSquareSide / 2
      }
    },

    projection: {
      get () {
        return d3.geoOrthographic()
          .translate([this.width / 2, this.height / 2])
          .clipAngle(90)
          .precision(0.1)
      }
    },

    graticule: {
      get () {
        return d3.geoGraticule()
      }
    },

    path: {
      get () {
        if (!this.isMounted) {
          return undefined
        }
        return d3.geoPath(this.projection, this.context)
      }
    },

    equirectangularProjection: {
      get () {
        return d3.geoEquirectangular()
          .translate([this.width / 2, this.height / 2])
          .scale(this.width / 7)
      }
    },

    equirectangularPath: {
      get () {
        if (!this.isMounted) {
          return undefined
        }
        return d3.geoPath(this.equirectangularProjection, this.equirectangularContext)
      }
    },

    autoRotationDegPerMilliSec: {
      get () {
        return this.autoRotationDegPerSec / 1000
      }
    },

    countryColorScale: {
      get () {
        return d3.scaleSqrt().domain([this.maxCount, 2000, 0]).range([0, 190])
      }
    }
  },

  watch: {
    isDataFetched () {
      if (this.isDataFetched) {
        console.log(this.covidConfirmed)
        console.log(this.world)
        this.setupEquirectangularColorKeys()
      }
    },

    width () {
      if (this.isMounted) {
        this.canvas.attr('width', this.width)
        this.equirectangularCanvas.attr('width', this.width)
        this.setupEquirectangularColorKeys()
      }
    },

    height () {
      if (this.isMounted) {
        this.canvas.attr('height', this.height)
        this.equirectangularCanvas.attr('height', this.height)
        this.setupEquirectangularColorKeys()
      }
    },

    radius () {
      this.scale = this.radius
    },

    scale () {
      this.projection.scale(this.scale)
    },

    rotations () {
      this.projection.rotate([this.rotations.yaw, this.rotations.pitch, this.rotations.roll])
    }
  },

  beforeMount () {
    window.addEventListener('resize', this.adjustDimensions)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.adjustDimensions)
  },

  mounted () {
    console.log('DOM mounted')

    console.log('Ajusting dimensions')
    this.adjustDimensions()

    console.log('Mounting canvas elements')
    this.canvas = d3
      .select('#canvasContainer')
      .append('canvas')
      .attr('id', 'canvas')
      .attr('width', this.width)
      .attr('height', this.height)

    this.equirectangularCanvas = d3
      .select('#canvasContainer')
      .append('canvas')
      .attr('width', this.width)
      .attr('height', this.height)

    this.context = this.canvas.node().getContext('2d')
    this.equirectangularContext = this.equirectangularCanvas.node().getContext('2d')
    this.isMounted = true

    console.log('Setting up initial projection configurations')
    this.equirectangularCanvas.remove()
    this.configureInitialProjection()

    console.log('Attaching event listener to canvas')
    this.canvas
      .on('mousemove', this.onMouseMove)
      .call(d3.drag()
        .on('start', this.onDragStart)
        .on('drag', this.onDrag)
        .on('end', this.onDragEnd)
      )
      .call(d3.zoom()
        .on('zoom', this.onZoom)
      )

    console.log('Setting draw loop timer')
    this.isRotating = true
    this.lastDrawLoopCallTime = d3.now()
    this.drawLoop = d3.timer(this.draw)

    console.log('Fetching data')
    this.fetchInitialData()
  },

  methods: {
    async fetchInitialData () {
      try {
        this.isDataFetched = false

        const worldMapFetchRequest = this.$axios.get(this.worldDataURL)
        const covidConfirmedFetchRequest = this.$axios.get(this.covidDataURLs.latestConfirmed)
        const covidGlobalFetchRequest = this.$axios.get(this.covidDataURLs.global)

        const [worldMapFetchResponse, covidConfirmedFetchResponse, covidGloalFetchResponse] = await Promise.all(
          [
            worldMapFetchRequest,
            covidConfirmedFetchRequest,
            covidGlobalFetchRequest
          ]
        )

        this.world = worldMapFetchResponse.data
        this.covidConfirmed = covidConfirmedFetchResponse.data
        this.covidGlobal = covidGloalFetchResponse.data

        this.worldLand = topojson.feature(this.world, this.world.objects.land)
        this.worldCountries = topojson.feature(this.world, this.world.objects.countries)

        this.generateCountryToCountMap(this.covidConfirmed)

        this.minCount = parseInt(this.covidGlobal.confirmed.min.count)
        this.maxCount = parseInt(this.covidGlobal.confirmed.max.count)

        this.isDataFetched = true
      } catch (error) {
        this.world = undefined
        this.worldLand = undefined
        this.worldCountries = undefined
        this.covidConfirmed = undefined
        this.isDataFetched = false
      }
    },

    generateCountryToCountMap (covidData) {
      this.countryToCount = {}

      covidData.forEach((entry) => {
        this.countryToCount[entry['country/region']] = parseInt(entry.data[0].count)
      })
    },

    adjustDimensions () {
      console.log('Adjusting dimensions')
      this.dimensions.screenWidth = document.documentElement.clientWidth
      this.dimensions.screenHeight = document.documentElement.clientHeight

      if (this.isMounted) {
        this.context.clearRect(0, 0, this.width, this.height)
      }

      this.dimensions.canvasSquareSide = Math.min(
        (this.dimensions.screenWidth * 0.95) - this.dimensions.canvasMargin,
        (this.dimensions.screenHeight * 0.7) - this.dimensions.canvasMargin
      )
    },

    getUniqueRGBColor () {
      const rgbColor = []

      if (this.nextUniqueColorSeed > 16777214) {
        this.nextUniqueColorSeed = 1
      }

      rgbColor.push(this.nextUniqueColorSeed & 0xFF)
      rgbColor.push((this.nextUniqueColorSeed & 0xFF00) >> 8)
      rgbColor.push((this.nextUniqueColorSeed & 0xFF0000) >> 16)

      this.nextUniqueColorSeed += 5

      const colorStr = 'rgb(' + rgbColor.join(',') + ')'
      return colorStr
    },

    setupEquirectangularColorKeys () {
      if (!this.isMounted || !this.isDataFetched) {
        return
      }

      let i = this.worldCountries.features.length

      while (i--) {
        const country = this.worldCountries.features[i]
        const color = this.getUniqueRGBColor()
        this.colorToCountry[color] = country

        // Set equirectangular projection's rgb color
        this.equirectangularContext.beginPath()
        this.equirectangularPath(country)
        this.equirectangularContext.fillStyle = color
        this.equirectangularContext.fill()
      }
    },

    getCountryFromEquirectangularImageData (imageData) {
      const rgbData = imageData.data
      const colorKey = 'rgb(' + rgbData[0] + ',' + rgbData[1] + ',' + rgbData[2] + ')'
      return this.colorToCountry[colorKey]
    },

    configureInitialProjection () {
      this.projection.scale(this.scale)
      this.projection.rotate([this.rotations.yaw, this.rotations.pitch, this.rotations.roll])
    },

    selectCountryFromPosition (pos) {
      const latLong = this.projection.invert(pos)
      const equirectangularPos = this.equirectangularProjection(latLong)

      if (equirectangularPos[0] > -1) {
        const imageData = this.equirectangularContext.getImageData(equirectangularPos[0], equirectangularPos[1], 1, 1)
        const country = this.getCountryFromEquirectangularImageData(imageData)

        if (country === undefined) {
          this.selectedCountry = undefined
        } else if (this.selectedCountry === undefined || this.selectedCountry.id !== country.id) {
          this.selectedCountry = country
          const name = this.selectedCountry.properties.name.toLowerCase()
          const count = this.countryToCount[name]

          if (count !== undefined) {
            this.selectedCountry.properties.count = count
          }
        }
      }
    },

    rotateFromDragEvent (event) {
      const rotate = this.projection.rotate()
      const k = this.dragSensitivity / this.projection.scale()

      this.rotations = {
        yaw: rotate[0] + event.dx * k,
        pitch: rotate[1] - event.dy * k,
        roll: this.rotations.roll
      }
    },

    getDistanceBetweenTwoPoints (points) {
      return Math.sqrt(((points[0][0] - points[1][0]) ** 2) + ((points[0][1] - points[1][1]) ** 2))
    },

    scaleFromPinchTouches (touches) {
      if (this.lastPinchDistance) {
        const currentPinchDistance = this.getDistanceBetweenTwoPoints(touches)

        if (currentPinchDistance === this.lastPinchDistance) {
          return
        } else if (currentPinchDistance > this.lastPinchDistance) {
          this.scale = Math.min(10000, this.scale * (1 + this.pinchZoomSensitivity))
        } else {
          this.scale = Math.max(100, this.scale * (1 - this.pinchZoomSensitivity))
        }
      }

      this.lastPinchDistance = this.getDistanceBetweenTwoPoints(touches)
    },

    onMouseMove () {
      const mousePos = d3.mouse(d3.event.target)
      this.selectCountryFromPosition(mousePos)
    },

    onZoom () {
      this.scale = this.radius * d3.event.transform.k
    },

    onDragStart () {
      const touches = d3.touches(d3.event.sourceEvent.target)

      if (touches.length < 2) {
        this.isRotating = !this.isRotating
        this.isBeingDragged = true
      } else if (touches.length === 2) {
        this.lastPinchDistance = this.getDistanceBetweenTwoPoints(touches)
      }
    },

    onDrag () {
      const touches = d3.touches(d3.event.sourceEvent.target)

      if (touches.length < 2) {
        this.rotateFromDragEvent(d3.event)
      } else if (touches.length === 2) {
        this.scaleFromPinchTouches(touches)
      }
    },

    onDragEnd () {
      if (this.isBeingDragged) {
        this.isRotating = !this.isRotating
        this.isBeingDragged = false
      }
    },

    render () {
      this.context.clearRect(0, 0, this.width, this.height)

      // Draw water (Sphere)
      this.context.lineWidth = 1.5
      this.context.fillStyle = this.colors.water

      this.context.beginPath()
      this.path({ type: 'Sphere' })
      this.context.fill()
      this.context.stroke()

      // Draw countries
      this.context.lineWidth = 0.3
      this.worldCountries.features.forEach((country) => {
        let color
        const countryName = country.properties.name.toLowerCase()
        const count = this.countryToCount[countryName]

        if (count !== undefined) {
          const scaledColorValue = this.countryColorScale(count)
          color = `rgb(${this.colors.landRed},${scaledColorValue},${scaledColorValue})`
        } else {
          color = this.colors.unavailableCountry
        }

        this.context.fillStyle = color
        this.context.beginPath()
        this.path(country)
        this.context.fill()
        this.context.stroke()
      })

      // Draw selected country
      if (this.selectedCountry !== undefined) {
        this.context.fillStyle = this.colors.selectedCountry
        this.context.beginPath()
        this.path(this.selectedCountry)
        this.context.fill()
      }
    },

    draw (elapsed) {
      if (this.isBeingDrawn || !this.isMounted || !this.isDataFetched) {
        return
      }

      this.isBeingDrawn = true
      const now = d3.now()
      const diff = now - this.lastDrawLoopCallTime

      if (diff < elapsed) {
        if (this.isRotating) {
          this.rotations = {
            yaw: this.rotations.yaw += diff * this.autoRotationDegPerMilliSec,
            pitch: this.rotations.pitch,
            roll: this.rotations.roll
          }
        }

        this.render()
      }

      this.lastDrawLoopCallTime = now
      this.isBeingDrawn = false
    }
  }
}
</script>

<style>
</style>
