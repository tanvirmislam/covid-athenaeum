<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align="center">
        <div v-if="!isInitialDataFetched">
          Fetching Data
          <span class="ml-1 subtitle-1"> <font-awesome-icon :icon="['fas', 'spinner']" spin /> </span>
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

    <v-snackbar v-model="showSpecificCountryDataPrompt" color="white darker-2" alight="center" justify="center">
      <v-btn class="subtitle-2" color="red" text @click.prevent="generateSpecificCountryData()">
        <span> <strong> {{ requestedSpecificCountryName }} </strong>: Show Details </span>
      </v-btn>

      <v-btn text class="subtitle-2" @click.prevent="showSpecificCountryDataPrompt = false">
        <span style="color: black;"> <font-awesome-icon :icon="['fas', 'times']" /> </span>
      </v-btn>
    </v-snackbar>

    <div align="center" justify="center" class="mr-5">
      <v-bottom-sheet v-model="showSpecificCountryData" scrollable inset max-width="800">
        <v-card class="command">
          <v-card-title class="grey lighten-2 justify-center">
            <span v-if="requestedSpecificCountryName !== undefined" class="subtitle-1"> <strong style="color: black;"> {{ requestedSpecificCountryName.toUpperCase() }} </strong> </span>
            <span v-else class="subtitle-1"> <strong style="color: black;"> Information </strong> </span>
          </v-card-title>

          <v-card-text justify="center" class="mt-5">
            <div v-if="!isSpecificCountryDataGenerated">
              Generating Data
              <span class="ml-1 subtitle-1"> <font-awesome-icon :icon="['fas', 'sun']" spin /> </span>
            </div>

            <v-container>
              <v-row align="center" justify="center">
                <v-col v-if="isSpecificCountryDataGenerated && specificCountrySummary !== undefined">
                  <v-card outlined>
                    <v-list dense>
                      <v-subheader> SUMMARY </v-subheader>
                      <v-list-item>
                        <v-list-item-content> Confirmed: {{ specificCountrySummary.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content> Deaths: {{ specificCountrySummary.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content> Recovered: {{ specificCountrySummary.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content> Mortality Rate: {{ specificCountrySummary.mortalityRate }} </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content> Recovery Rate: {{ specificCountrySummary.recoveryRate }} </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
                <v-col id="specificCountryGrowthCurveContainer" align="center" justify="center" />
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-bottom-sheet>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

export default {
  data () {
    return {
      worldMapData: {
        land: undefined,
        countries: undefined
      },
      covidData: {
        countriesLatestConfirmed: undefined,
        global: undefined,
        display: {
          type: undefined,
          countryToCountMap: undefined,
          minCount: undefined,
          maxCount: undefined
        }
      },
      isInitialDataFetched: false,

      canvas: undefined,
      context: undefined,
      equirectangularCanvas: undefined,
      equirectangularContext: undefined,
      colorKeyToCountryMap: {},
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
        water: '#5CA8BF',
        growthCurve: '#69B3A2'
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

      nextUniqueColorSeed: 1,

      showSpecificCountryDataPrompt: false,
      showSpecificCountryData: false,
      requestedSpecificCountryName: undefined,
      isSpecificCountryDataGenerated: false,
      specificCountryGrowthCurve: undefined,
      specificCountrySummary: undefined
    }
  },

  computed: {
    ...mapGetters({
      url: 'urls/url'
    }),

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
        return d3.scaleSqrt().domain([this.covidData.display.maxCount, 2000, 0]).range([0, 190])
      }
    }
  },

  watch: {
    isInitialDataFetched () {
      if (this.isInitialDataFetched) {
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
    },

    showSpecificCountryData () {
      if (!this.showSpecificCountryData) {
        d3.select('#specificCountryGrowthCurveContainer').selectAll('*').remove()
      }
    }
  },

  beforeMount () {
    window.addEventListener('resize', this.adjustDimensions)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.adjustDimensions)
  },

  mounted () {
    this.adjustDimensions()

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

    this.equirectangularCanvas.remove()
    this.configureInitialProjection()

    this.canvas
      .on('mousemove', this.onMouseMove)
      .on('click', this.onMouseClick)
      .on('touchstart', this.onTouchStart)
      .on('touchend', this.onTouchEnd)
      .call(d3.drag()
        .on('start', this.onDragStart)
        .on('drag', this.onDrag)
        .on('end', this.onDragEnd)
      )
      .call(d3.zoom()
        .on('zoom', this.onZoom)
      )

    this.isRotating = true
    this.lastDrawLoopCallTime = d3.now()
    this.drawLoop = d3.timer(this.draw)

    this.fetchInitialData()
  },

  methods: {
    async fetchInitialData () {
      try {
        this.isInitialDataFetched = false

        const worldMapFetchRequest = this.$axios.get(this.url.worldMapData)
        const covidLatestConfirmedFetchRequest = this.$axios.get(`${this.url.covidData.countriesConfirmed}?onlyLatest=true`)
        const covidGlobalFetchRequest = this.$axios.get(this.url.covidData.global)

        const [worldMapFetchResponse, covidLatestConfirmedFetchResponse, covidGlobalFetchResponse] = await Promise.all(
          [
            worldMapFetchRequest,
            covidLatestConfirmedFetchRequest,
            covidGlobalFetchRequest
          ]
        )

        this.worldMapData.land = topojson.feature(worldMapFetchResponse.data, worldMapFetchResponse.data.objects.land)
        this.worldMapData.countries = topojson.feature(worldMapFetchResponse.data, worldMapFetchResponse.data.objects.countries)

        this.covidData.countriesLatestConfirmed = covidLatestConfirmedFetchResponse.data
        this.covidData.global = covidGlobalFetchResponse.data

        this.generateDisplayData('confirmed', this.covidData.countriesLatestConfirmed)

        this.isInitialDataFetched = true
      } catch (error) {
        this.isInitialDataFetched = false
      }
    },

    generateDisplayData (type, data) {
      this.covidData.display.countryToCountMap = {}

      data.forEach((entry) => {
        this.covidData.display.countryToCountMap[entry['country/region']] = Number(entry.data[0].count)
      })

      this.covidData.display.minCount = Number(this.covidData.global[type].min.count)
      this.covidData.display.maxCount = Number(this.covidData.global[type].max.count)
    },

    async generateSpecificCountryData () {
      this.showSpecificCountryDataPrompt = false
      this.showSpecificCountryData = true

      this.isSpecificCountryDataGenerated = false

      const margin = { top: 20, bottom: 20, left: 60, right: 20 }
      const height = 250 - margin.top - margin.bottom
      const width = 300 - margin.left - margin.right

      const [covidConfirmedResponse, covidSummaryResponse] = await Promise.all(
        [
          this.$axios.get(`${this.url.covidData.countriesConfirmed}?country=${this.requestedSpecificCountryName}`),
          this.$axios.get(`${this.url.covidData.countrySummaryBase}/${this.requestedSpecificCountryName}`)
        ]
      )

      if (covidConfirmedResponse.data.length === 0 || Object.keys(covidSummaryResponse).length === 0) {
        this.specificCountrySummary = {
          confirmed: 'Unknown',
          deaths: 'Unknown',
          recovered: 'Unknown',
          mortalityRate: 'Unknown',
          recoveryRate: 'Unknown'
        }
        this.isSpecificCountryDataGenerated = true
        return
      }

      const curveData = covidConfirmedResponse.data[0].data
      const summaryData = covidSummaryResponse.data.data

      this.specificCountrySummary = { ...summaryData }

      const x = d3
        .scaleTime()
        .domain(d3.extent(curveData, d => d3.timeParse('%m/%d/%Y')(d.date)))
        .range([0, width])

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(curveData, d => Number(d.count))])
        .range([height, 0])

      this.specificCountryGrowthCurve = d3
        .select('#specificCountryGrowthCurveContainer')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      this.specificCountryGrowthCurve
        .append('g')
        .attr('transform', `translate(${0},${height})`)
        .call(d3.axisBottom(x).ticks(5))

      this.specificCountryGrowthCurve
        .append('g')
        .call(d3.axisLeft(y))

      this.specificCountryGrowthCurve
        .append('path')
        .datum(curveData)
        .attr('fill', 'none')
        .attr('stroke', this.colors.growthCurve)
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3.line()
            .x(d => x(d3.timeParse('%m/%d/%Y')(d.date)))
            .y(d => y(d.count))
        )

      this.specificCountryGrowthCurve
        .append('g')
        .selectAll('dot')
        .data(curveData)
        .enter()
        .append('circle')
        .attr('cx', d => x(d3.timeParse('%m/%d/%Y')(d.date)))
        .attr('cy', d => y(d.count))
        .attr('r', 2)
        .attr('fill', this.colors.growthCurve)

      this.isSpecificCountryDataGenerated = true
    },

    adjustDimensions () {
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
      if (!this.isMounted || !this.isInitialDataFetched) {
        return
      }

      let i = this.worldMapData.countries.features.length

      while (i--) {
        const country = this.worldMapData.countries.features[i]
        const color = this.getUniqueRGBColor()
        this.colorKeyToCountryMap[color] = country

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
      return this.colorKeyToCountryMap[colorKey]
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
          const count = this.covidData.display.countryToCountMap[name]

          if (count !== undefined) {
            this.selectedCountry.properties.count = count
          }
        }
      } else {
        this.selectedCountry = undefined
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

    onMouseClick () {
      if (this.selectedCountry !== undefined) {
        this.showSpecificCountryDataPrompt = true
        this.requestedSpecificCountryName = this.selectedCountry.properties.name
      }
    },

    onZoom () {
      this.scale = this.radius * d3.event.transform.k
    },

    onDragStart () {
      const touches = d3.touches(d3.event.sourceEvent.target)

      if (touches.length < 2) {
        this.dragStartTime = d3.now()
        this.isBeingDragged = true
        this.isRotating = !this.isRotating
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
        this.isBeingDragged = false
        this.isRotating = !this.isRotating
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
      this.worldMapData.countries.features.forEach((country) => {
        let color
        const name = country.properties.name.toLowerCase()
        const count = this.covidData.display.countryToCountMap[name]

        if (count !== undefined) {
          const scaledColor = this.countryColorScale(count)
          color = `rgb(${this.colors.landRed},${scaledColor},${scaledColor})`
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
      if (this.isBeingDrawn || !this.isMounted || !this.isInitialDataFetched) {
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
  .v-list-item {
    max-height: 5px;
  }
</style>
