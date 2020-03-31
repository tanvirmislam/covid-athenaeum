<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align="center">
        <div v-if="!isDataFetched">
          Fetching Data ...
        </div>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col id="canvasContainer" align="center" />
    </v-row>
    <v-row align="center" justify="center">
      <v-col align="center">
        <div v-if="selectedCountry !== undefined">
          {{ selectedCountry.name }}
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
      earthquakeDataURL: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-01-02',
      worldDataURL: 'https://unpkg.com/world-atlas@1.1.4/world/110m.json',
      countryDataURL: 'https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv',
      isDataFetched: false,

      earthquakes: undefined,
      world: undefined,
      worldLand: undefined,
      worldCountries: undefined,
      countryList: undefined,

      canvas: undefined,
      context: undefined,
      equirectangularCanvas: undefined,
      equirectangularContext: undefined,
      colorToCountry: {},
      isMounted: false,

      dimensions: {
        screenWidth: undefined,
        screenHeight: undefined,
        canvasSquareSide: 400
      },

      rotations: {
        yaw: 0,
        pitch: -10,
        roll: 0
      },

      colors: {
        water: '#5CA8BF',
        land: '#91755C',
        selectedCountry: '#F2E4E4',
        earthquake: '#E32929'
      },

      autoRotationDegPerSec: 5,
      drawLoop: undefined,
      lastDrawLoopCallTime: undefined,
      isRotating: false,
      isBeingDrawn: false,

      selectedCountry: undefined,
      dragSensitivity: 75,
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

    earthquakeMagnitudeScale: {
      get () {
        return d3.scaleSqrt()
          .domain([0, 100])
          .range([0, 10])
      }
    }
  },

  watch: {
    rotations () {
      this.projection.rotate([this.rotations.yaw, this.rotations.pitch, this.rotations.roll])
    }
  },

  async mounted () {
    console.log('DOM mounted')

    console.log('Fetching data')
    await this.fetchData()
    this.isDataFetched = true

    console.log(this.earthquakes)
    console.log(this.world)
    console.log(this.countryList)

    console.log('Mounting canvas elements')
    this.canvas = d3
      .select('#canvasContainer')
      .append('canvas')
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

    this.equirectangularCanvas.remove()
    this.configureInitialProjection()

    console.log('Drawing equirectangular projection')
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

    console.log('Attaching event listener to canvas')
    this.canvas
      .on('mousemove', this.selectCountry)
      .on('touchstart', this.selectCountry)
      .call(d3.drag()
        .on('start', this.onDragStart)
        .on('drag', this.onDrag)
        .on('end', this.onDragEnd)
      )

    console.log('Setting draw loop timer')
    this.isRotating = true
    this.lastDrawLoopCallTime = d3.now()
    this.drawLoop = d3.timer(this.draw)
  },

  methods: {
    async fetchData () {
      try {
        const earthquakeFetchRequest = this.$axios.get(this.earthquakeDataURL)
        const worldMapFetchRequest = this.$axios.get(this.worldDataURL)
        const countryListFetchRequest = this.$axios.get(this.countryDataURL)

        const [earthquakeFetchResponse, worldMapFetchResponse, countryListFetchResponse] = await Promise.all([earthquakeFetchRequest, worldMapFetchRequest, countryListFetchRequest])

        this.earthquakes = earthquakeFetchResponse.data

        this.world = worldMapFetchResponse.data
        this.worldLand = topojson.feature(this.world, this.world.objects.land)
        this.worldCountries = topojson.feature(this.world, this.world.objects.countries)

        this.countryList = this.tsv2json(countryListFetchResponse.data)
      } catch (error) {
        this.earthquake = undefined

        this.world = undefined
        this.worldLand = undefined
        this.worldCountries = undefined

        this.countryList = undefined
      }
    },

    configureInitialProjection () {
      this.projection.scale(this.radius)
      this.projection.rotate([this.rotations.yaw, this.rotations.pitch, this.rotations.roll])
    },

    draw (elapsed) {
      if (this.isDrawing) {
        return
      }

      this.isDrawing = true
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

        if (this.isMounted && this.isDataFetched) {
          this.render()
        }
      }

      this.lastDrawLoopCallTime = now
      this.isDrawing = false
    },

    render () {
      this.context.clearRect(0, 0, this.width, this.height)

      // Draw circle
      this.context.lineWidth = 1.5
      this.context.fillStyle = this.colors.water

      this.context.beginPath()
      this.context.arc(this.width / 2, this.height / 2, this.radius, 0, 2 * Math.PI)
      this.context.fill()
      this.context.stroke()

      // Draw countries
      this.context.lineWidth = 0.5
      this.context.fillStyle = this.colors.land

      this.context.beginPath()
      this.path(this.worldCountries)
      this.context.fill()
      this.context.stroke()

      // Draw selected country
      if (this.selectedCountry !== undefined) {
        this.context.beginPath()
        this.path(this.selectedCountry)
        this.context.fillStyle = this.colors.selectedCountry
        this.context.fill()
      }

      // Draw earthquakes
      const color = d3.color(this.colors.earthquake)
      color.opacity = 0.50
      this.context.fillStyle = color

      const defaultPointRadiusFunction = this.path.pointRadius

      this.path.pointRadius(
        (quake) => {
          return this.earthquakeMagnitudeScale(Math.exp(quake.properties.mag))
        }
      )

      this.earthquakes.features.forEach(
        (quake) => {
          this.context.beginPath()
          this.path(quake)
          this.context.fill()
          this.context.stroke()
        }
      )

      this.path.pointRadius(defaultPointRadiusFunction)
    },

    selectCountry () {
      const mousePos = d3.mouse(d3.event.target)
      const latLong = this.projection.invert(mousePos)
      const equirectangularPos = this.equirectangularProjection(latLong)

      if (equirectangularPos[0] > -1) {
        const imageData = this.equirectangularContext.getImageData(equirectangularPos[0], equirectangularPos[1], 1, 1)
        const country = this.getCountryFromImageData(imageData)

        if (country === undefined) {
          this.selectedCountry = undefined
        } else if (this.selectedCountry === undefined || this.selectedCountry.id !== country.id) {
          this.selectedCountry = country
          const countryInfo = this.countryList.find(c => parseInt(c.id) === parseInt(this.selectedCountry.id))
          this.selectedCountry.name = (countryInfo && countryInfo.name) || ''
        }
      }
    },

    onDragStart () {
      this.isRotating = false
    },

    onDrag () {
      const rotate = this.projection.rotate()
      const k = this.dragSensitivity / this.projection.scale()

      this.rotations = {
        yaw: rotate[0] + d3.event.dx * k,
        pitch: rotate[1] - d3.event.dy * k,
        roll: this.rotations.roll
      }
    },

    onDragEnd () {
      this.isRotating = true
    },

    getCountryFromImageData (imageData) {
      const rgbData = imageData.data
      const colorKey = 'rgb(' + rgbData[0] + ',' + rgbData[1] + ',' + rgbData[2] + ')'
      return this.colorToCountry[colorKey]
    },

    getUniqueRGBColor () {
      const rgbColor = []

      if (this.nextUniqueColorSeed < 16777215) {
        rgbColor.push(this.nextUniqueColorSeed & 0xFF)
        rgbColor.push((this.nextUniqueColorSeed & 0xFF00) >> 8)
        rgbColor.push((this.nextUniqueColorSeed & 0xFF0000) >> 16)

        this.nextUniqueColorSeed += 5
      }

      const colorStr = 'rgb(' + rgbColor.join(',') + ')'
      return colorStr
    }
  }
}
</script>

<style>
</style>
