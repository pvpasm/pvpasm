<template>
  <b-container class="content">
    <b-row class="h-100">
      <div class="mx-auto my-auto">
        <carousel
          ref="carousel"
          :key="carouselKey"
          :navigationEnabled="true"
          :perPage="1"
          class="my-auto"
        >
          <slide>             
            <b-container class="h-100">
              <b-row class="h-100">
                <b-card class="bg-primary my-auto mx-auto text-white w-75">
                  <b-row>
                    <b-col>
                      <h4>How to play?</h4>

                      <div class="py-2">
                        <ul>
                          <li class="pt-1">
                            There will be 3 <code>x86</code> assembly snippets, each representing a function, with varying levels of difficulty.
                          </li>
                          <li class="pt-1">
                            The AMD64 calling convention will be followed, i.e. arguments are in registers <code>rdi</code>, <code>rsi</code>, <code>rdx</code>, ... and <code>rax</code> will contain the return value.
                          </li>
                          <li class="pt-1">
                            You will provide a C function that best represents that snippet, which will be validated by the server through a series of test cases.
                          </li>
                          <li class="pt-1">
                            As of now, only the function signature <code>int f(int a)</code> is present. More will be added in the future.
                          </li>
                        </ul>
                      </div>
                    </b-col>
                    
                    <b-col>
                      <p>For example, given</p>

                      <code class="code">xor eax, eax;
add eax, 1;
add eax, edi;</code>

                      <p>
                        As a function, with argument <code>a0</code>, the return value would be <code>a0 - 1</code>. So, our answer to this puzzle would be
                      </p>

                      <code class="code">int f(int a)
{
  return a - 1;
}</code>
                    </b-col>
                                  
                    <a class="btn btn-secondary btn-block mt-2" @click="start">
                      Start
                    </a>
                  </b-row>
                </b-card>
              </b-row>
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
    </b-row>
  </b-container>
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
      carouselKey: 0
    }
  },
  computed: {
    numSolved() {
      return this.$store.state.challenge.numSolved
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
      if (!this.isStart) {
        this.$store.commit('challenge/reset')

        // register start
        await this.$axios.post(`/api/challenge/start`)

        this.isStart = true
        this.carouselKey += 1
        // short delay for <Puzzle/> to be rendered
        await sleep(1)
      }
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
  font-size: 0.8em;
  background: #f7f7f7;
  color: black;
  display: block;
  white-space: pre;
  overflow-x: auto;
  word-wrap: normal;
  margin: 1em;
  padding: 1em;
}
</style>
