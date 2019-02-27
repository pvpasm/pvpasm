<template>
  <div>
    <div class="timer" v-if="isStart">
      {{ prettyTime }}
    </div>

    <b-container>
      <div class="mx-auto my-5">
        <carousel
          ref="carousel"
          :key="carouselKey"
          :navigationEnabled="true"
          :perPage="1"
          :mouseDrag="false"
        >
          <slide>
            <b-container class="my-5">
              <b-row>
                <b-col>
                  <h4>How to play?</h4>

                  <div class="py-2">
                    <ul>
                      <li class="py-2">
                        There will be 3 <code>x86</code> assembly snippets, each representing a function, with varying levels of difficulty.
                      </li>
                      <li class="py-2">
                        The AMD64 calling convention will be followed, i.e. arguments are in registers <code>rdi</code>, <code>rsi</code>, <code>rdx</code>, ... and <code>rax</code> will contain the return value.
                      </li>
                      <li class="py-2">
                        You will provide a C function that best represents that snippet, which will be validated by the server through a series of test cases.
                      </li>
                      <li class="py-2">
                        As of now, only the function signature <code>int f(int a)</code> is present. More will be added in the future.
                      </li>
                    </ul>
                  </div>
                </b-col>
                
                <b-col offset="1">
                  <p>For example, given</p>

                  <code class="code">xor eax, eax;
add eax, 1;
add eax, edi;</code>

                  <p class="mt-4">
                    As a function, with argument <code>a</code>, the return value would be <code>a + 1</code>. So, our answer to this puzzle would be
                  </p>

                  <code class="code">int f(int a)
{
  return a - 1;
}</code>
                </b-col>
              </b-row>

              <div class="text-center" v-if="!isStart">          
                <a class="btn btn-primary mt-5 text-white" @click="start">
                  Start
                </a>
              </div>

            </b-container>
          </slide>
          <slide v-if="isStart">
            <Puzzle :num="0" @viewResults="viewResults" />
          </slide>
          <slide v-if="isStart">
            <Puzzle :num="1" @viewResults="viewResults"/>
          </slide>
          <slide v-if="isStart">
            <Puzzle :num="2" @viewResults="viewResults"/>
          </slide>
          <slide v-if="isDone">              
            <Result />
          </slide>
        </carousel>
      </div>
    </b-container>
  </div>
</template>

<script>
import Puzzle from '@/components/Puzzle.vue'
import Result from '@/components/Result.vue'

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  name: 'Classic',
  components: {
    Result,
    Puzzle
  },
  data() {
    return {
      isStart: false,
      isDone: false,
      carouselKey: 0,
      time: 0,
      timer: null
    }
  },
  computed: {
    numSolved() {
      return this.$store.state.challenge.numSolved
    },
    prettyTime() {
      const time = this.time / 60
      const minutes = parseInt(time)
      const seconds = Math.round((time - minutes) * 60)

      const sMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
      const sSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
      return sMinutes + ':' + sSeconds
    }
  },
  watch: {
    numSolved(newv, oldv) {
      if (newv === 3) {
        this.end()
      }
    }
  },
  methods: {
    async start() {
      this.$store.commit('challenge/reset')

      // register start
      await this.$axios.post(`/api/challenge/start`)

      this.isStart = true
      this.carouselKey += 1
      // short delay for <Puzzle/> to be rendered
      await sleep(0.05)

      this.timer = setInterval(() => {
        if (!this.isDone) this.time++
      }, 1000)

      this.$refs.carousel.goToPage(1)
    },
    async end() {
      const { data } = await this.$axios.post(`/api/challenge/end`)
      this.$store.commit('challenge/updateResult', data)

      this.isDone = true
    },
    viewResults() {
      this.$refs.carousel.goToPage(4)
    }
  }
}
</script>

<style>
.code {
  font-family: 'Source Code Pro', monospace;
  font-size: 0.9em;
  background: #f7f7f7;
  color: black;
  display: block;
  white-space: pre;
  overflow-x: auto;
  word-wrap: normal;
  padding: 1em;
}

.timer {
  position: relative;
  top: 40px;
  right: 60px;
  text-align: right;
  font-family: 'Orbitron', sans-serif;
  font-size: 2em;
}
</style>
