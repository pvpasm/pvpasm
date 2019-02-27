<template>
  <b-container class="h-100">
    <b-row class="h-100">
      <div class="mx-auto my-auto puzzle-container">
        <b-row>
          <b-col md="4">
            <code class="code h-100">{{ puzzle }}</code>
          </b-col>

          <b-col>
            <no-ssr placeholder="Codemirror Loading...">
              <codemirror 
                v-model="code" 
                :options="cmOptions"
              >
              </codemirror>
            </no-ssr>

            <b-row class="mt-3" v-if="status == -1">
              <b-col>
                <b-form-select
                  v-model="theme"
                  :options="themes"
                  @change="updateTheme"
                  size="sm"
                />
              </b-col>
              
              <b-col>
                <b-button
                  class="code-button float-right"
                  variant="primary"
                  :disabled="status != -1 || !code"
                  v-if="!ended"
                  @click="submit"
                >
                  Submit
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        
        <b-row v-if="error">
          <div class="puzzle-result m-3 w-100 p-3">
            <h5 class="mb-3">Compilation Failed</h5>
            <pre class="error-msg">
              {{ error }}
            </pre>
          </div>
        </b-row>

        <b-row v-if="status != -1">
          <div class="puzzle-result m-3 w-100 p-3">
            <div v-if="correct">
              Passed all test cases <fa icon="check" class="mx-1" style="color: green" />
            </div>
            <div v-else>
              Failed <fa icon="times" class="mx-1" style="color: red" />
            </div>
          </div>
        </b-row>

        <b-button class="float-right" variant="primary" v-on:click="$emit('viewResults')" v-if="ended">
          View Results
        </b-button>
      </div>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Puzzle',
  props: {
    num: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      error: '',
      puzzle: '',
      status: -1,
      theme: 'material',
      themes: [
        { value: 'default', text: 'light' },
        { value: 'material', text: 'dark' }
      ],
      code: 'int f(int a) {\n    \n}',
      cmOptions: {
        tabSize: 4,
        foldGutter: true,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        keyMap: 'sublime',
        mode: 'text/x-csrc',
        theme: 'material',
        extraKeys: {
          Tab(cm) {
            cm.replaceSelection('    ')
          }
        }
      }
    }
  },
  computed: {
    ended() {
      return this.$store.state.challenge.numSolved === 3
    },
    correct() {
      return this.status === 1
    }
  },
  async created() {
    const { data } = await this.$axios.get(`/api/challenge/chall/${this.num}`)
    this.puzzle = data.code
  },
  methods: {
    getCardClass() {
      return {
        'bg-primary text-white': this.status === -1,
        'bg-success text-white': this.status === 1,
        'bg-danger text-white': this.status === 0
      }
    },
    async submit() {
      this.error = ''

      const { data } = await this.$axios.post(
        `/api/challenge/chall/${this.num}`,
        {
          code: this.code
        }
      )
      this.status = data.result
      this.error = data.error

      if (this.status !== -1) {
        this.$store.commit('challenge/updatePuzzleStatus', {
          index: this.num,
          status: this.status
        })
      }
    },
    updateTheme(newTheme) {
      this.cmOptions.theme = newTheme
    }
  }
}
</script>

<style>
textarea {
  font-family: 'Source Code Pro', monospace;
}

.code-button {
  position: relative;
  bottom: 0;
}

.puzzle-container {
  width: 95%;
}

.puzzle-result {
  background: #f7f7f7;
}

.error-msg {
  font-family: 'Source Code Pro', monospace;
  white-space: pre-line;
}
</style>
