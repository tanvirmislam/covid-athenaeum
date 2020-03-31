<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align="center">
        <canvas id="globe" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col align="center">
        <h2 id="current" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import * as versor from 'versor'

export default {
  data () {
    return {
      current: undefined,
      canvas: undefined,
      isMounted: false,
      isRotating: false,

      orthographicPrecision: 0.1,
      scaleFactor: 0.5,
      autoRotationDelay: 3000,
      autoRotationDegreePerSec: 5,
      water: { type: 'Sphere' },

      drawLoop: undefined,
      lastDrawCallTime: d3.now(),

      dimensions: {
        windowWidth: 0,
        windowHeight: 0,

        globeWidth: 0,
        globeHeight: 0,

        globeMarginTop: 0,
        globeMarginBottom: 0,
        globeMarginLeft: 0,
        globeMarginRight: 0
      },

      initialGlobeAngles: {
        x: -20,
        y: 40,
        z: 0
      },

      colors: {
        water: '#73bfc9',
        land: '#997a4b',
        graticule: '#ccc',
        country: '#a00'
      },

      mousePositionAtStart: undefined,
      eulerProjectionRotationAtStart: undefined,
      versorProjectionRotationAtStart: undefined,

      land: undefined,
      countries: undefined,
      countryList: undefined,
      currentCountry: undefined,

      rotation: undefined
    }
  },

  computed: {
    context: {
      get () {
        if (!this.isMounted) {
          return undefined
        }
        return this.canvas.node().getContext('2d')
      }
    },

    projection: {
      get () {
        return d3.geoOrthographic().precision(this.orthographicPrecision)
      }
    },

    path: {
      get () {
        if (!this.isMounted) {
          return undefined
        }
        return d3.geoPath(this.projection).context(this.context)
      }
    },

    graticule: {
      get () {
        return d3.geoGraticule10()
      }
    },

    autoRotationDegreePerMilliSec: {
      get () {
        return this.autoRotationDegreePerSec / 1000
      }
    }
  },

  beforeDestroy () {
    if (process.browser) {
      window.removeEventListener('resize', this.adjustDimensions)
    }
  },

  async mounted () {
    this.current = d3.select('#current')
    this.canvas = d3.select('#globe')
    this.isMounted = true
    this.isRotating = true

    this.setInitialGlobeAngles()
    await this.setTopojsonFeatures()
    console.log(this.countries)

    this.canvas
      .call(d3.drag()
        .on('start', this.dragStarted)
        .on('drag', this.onDrag)
        .on('end', this.dragEnded)
      )
      .on('mousemove', this.onMouseMove)

    window.addEventListener('resize', this.adjustDimensions)
    this.adjustDimensions()

    this.drawLoop = d3.timer(this.draw)
  },

  methods: {
    draw (elapsed) {
      const now = d3.now()
      const timeDiff = now - this.lastDrawCallTime

      if (timeDiff < elapsed) {
        if (this.isRotating) {
          const rotation = this.projection.rotate()
          rotation[0] += timeDiff * this.autoRotationDegreePerMilliSec
          this.projection.rotate(rotation)
        }

        this.render()
      }

      this.lastDrawCallTime = now
    },

    render () {
      this.context.clearRect(0, 0, this.dimensions.globeWidth, this.dimensions.globeHeight)
      this.fill(this.water, this.colors.water)
      this.stroke(this.graticule, this.colors.graticule)
      this.fill(this.land, this.colors.land)

      if (this.currentCountry) {
        this.fill(this.currentCountry, this.colors.country)
      }
    },

    adjustDimensions () {
      this.dimensions.windowWidth = document.documentElement.clientWidth
      this.dimensions.windowHeight = document.documentElement.clientHeight

      this.dimensions.globeWidth = this.dimensions.windowWidth - this.dimensions.globeMarginLeft - this.dimensions.globeMarginRight
      this.dimensions.globeHeight = this.dimensions.windowHeight - this.dimensions.globeMarginTop - this.dimensions.globeMarginBottom

      // const rect = document.querySelector('#globe').getBoundingClientRect()
      // this.width = rect.width
      // this.height = rect.height

      if (this.isMounted) {
        this.canvas.attr('width', this.dimensions.globeWidth).attr('height', this.dimensions.globeHeight)

        this.projection
          .scale(this.scaleFactor * Math.min(this.dimensions.globeWidth, this.dimensions.globeHeight))
          .translate([this.dimensions.globeWidth / 2, this.dimensions.globeHeight / 2])
          .clipAngle(90)

        this.render()
      }
    },

    setInitialGlobeAngles () {
      const rotation = this.projection.rotate()

      rotation[0] = this.initialGlobeAngles.y
      rotation[1] = this.initialGlobeAngles.x
      rotation[2] = this.initialGlobeAngles.z

      this.projection.rotate(rotation)
    },

    async setTopojsonFeatures () {
      const worldData = await this.fetchWorldData()
      const countryData = await this.fetchCountryData()

      this.land = topojson.feature(worldData, worldData.objects.land)
      this.countries = topojson.feature(worldData, worldData.objects.countries)
      this.countryList = countryData
    },

    enter (country) {
      const targetCountry = this.countryList.find((c) => {
        return c.id === country.id
      })
      this.current.text((targetCountry && targetCountry.name) || '')
    },

    leave (country) {
      this.current.text('')
    },

    startAutoRotation (delay) {
      this.isRotating = true
      // this.drawLoop.restart(this.draw, delay || 0)
    },

    stopAutoRotation () {
      this.isRotating = false
    },

    getCountry (event) {
      if (!this.isMounted) {
        return undefined
      }

      const mousePos = d3.mouse(event.target)
      const mouseX = mousePos[0] + event.target.offsetLeft
      const mouseY = mousePos[1] + event.target.offsetTop
      // const mouseX = event.screenX + event.offsetX
      // const mouseY = event.screenY + event.offsetY

      // const pos = this.projection.invert(mousePos)
      const pos = this.projection.invert([mouseX, mouseY])

      console.log('\ngetCountry()')
      // console.log(mousePos)
      console.log([mouseX, mouseY])
      // console.log(pos)
      console.log(event)
      return this.countries.features.find((f) => {
        return f.geometry.coordinates.find((c1) => {
          return this.polygonContains(c1, pos) || c1.find((c2) => {
            return this.polygonContains(c2, pos)
          })
        })
      })
    },

    onMouseMove () {
      const c = this.getCountry(d3.event)

      if (!c) {
        if (this.currentCountry !== undefined) {
          this.leave(this.currentCountry)
          this.currentCountry = undefined
        }
      } else if (c !== this.currentCountry) {
        this.currentCountry = c
        this.enter(c)
      }
    },

    dragStarted () {
      console.log('Drag started')

      this.stopAutoRotation()

      console.log('Rotation stopped')
      console.log(d3.event)

      this.mousePositionAtStart = versor.cartesian(this.projection.invert([d3.event.x, d3.event.y]))
      this.eulerProjectionRotationAtStart = this.projection.rotate()
      this.versorProjectionRotationAtStart = versor(this.eulerProjectionRotationAtStart)
    },

    onDrag () {
      const pos = versor.cartesian(this.projection.rotate(this.eulerProjectionRotationAtStart).invert([d3.event.x, d3.event.y]))
      const ver = versor.multiply(this.versorProjectionRotationAtStart, versor.delta(this.mousePositionAtStart, pos))
      const eul = versor.rotation(ver)

      this.projection.rotate(eul)
      // this.render()
    },

    dragEnded () {
      this.startAutoRotation(this.autoRotationDelay)
    },

    fill (object, color) {
      this.context.beginPath()
      this.path(object)
      this.context.fillStyle = color
      this.context.fill()
    },

    stroke (object, color) {
      this.context.beginPath()
      this.path(object)
      this.context.strokeStyle = color
      this.context.stroke()
    },

    async fetchWorldData () {
      try {
        const data = await d3.json('https://unpkg.com/world-atlas@1/world/110m.json')
        return data
      } catch (err) {
        return undefined
      }
    },

    async fetchCountryData () {
      try {
        const data = await d3.tsv('https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv')
        return data
      } catch (err) {
        return undefined
      }
    },

    polygonContains (polygon, point) {
      const n = polygon.length
      const x = point[0]
      const y = point[1]

      let p = polygon[n - 1]

      let x0 = p[0]
      let y0 = p[1]
      let x1
      let y1

      let inside = false

      for (let i = 0; i < n; ++i) {
        p = polygon[i]
        x1 = p[0]
        y1 = p[1]

        if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) {
          inside = !inside
        }

        x0 = x1
        y0 = y1
      }

      return inside
    }
  }
}
</script>

<style>
#globeDataContainer {
  height: 100%;
  width: 100;
}

#globeAnimationRow {
  height: 50%;
  width: 100%;
}

#globeAnimationCol {
  height: 100%;
  width: 100%;
}

#globe {
  cursor: move;
  height: 100%;
  width: 100%;
}

#currentCoutryRow {
  height: 50%;
  width: 50%;
}

#current {
  position: absolute;
  color: white;
  font-family: sans-serif;
  margin-left: 4%;
  margin-top: 4%;
}
</style>
