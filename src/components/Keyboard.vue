<template>
  <div>
    <div class="keyboard" v-if="visible">
      <div class="keyboard-row keyboard-output">
        <button @click.prevent="txt = ''">X</button>
        <input type="text" class="exampleText" v-model="txt" v-on:focus="visible = true">
        <button @click.prevent="submitText()">Klaar</button>
      </div>
      <div class="keyboard-row keyboard-row-1">
        <button @click.prevent="addSymbol('1')">{{ symbol('1') }}</button>
        <button @click.prevent="addSymbol('2')">{{ symbol('2') }}</button>
        <button @click.prevent="addSymbol('3')">{{ symbol('3') }}</button>
        <button @click.prevent="addSymbol('4')">{{ symbol('4') }}</button>
        <button @click.prevent="addSymbol('5')">{{ symbol('5') }}</button>
        <button @click.prevent="addSymbol('6')">{{ symbol('6') }}</button>
        <button @click.prevent="addSymbol('7')">{{ symbol('7') }}</button>
        <button @click.prevent="addSymbol('8')">{{ symbol('8') }}</button>
        <button @click.prevent="addSymbol('9')">{{ symbol('9') }}</button>
        <button @click.prevent="addSymbol('0')">{{ symbol('0') }}</button>
        <button @click.prevent="addSymbol('-')">{{ symbol('-') }}</button>
        <button @click.prevent="addSymbol('=')">{{ symbol('=') }}</button>
        <button @click.prevent="removeLastChar()">Backspace</button>
      </div>
      <div class="keyboard-row keyboard-row-2">
        <button @click.prevent="addLetter('q')">{{ letter('q') }}</button>
        <button @click.prevent="addLetter('w')">{{ letter('w') }}</button>
        <button @click.prevent="addLetter('e')">{{ letter('e') }}</button>
        <button @click.prevent="addLetter('r')">{{ letter('r') }}</button>
        <button @click.prevent="addLetter('t')">{{ letter('t') }}</button>
        <button @click.prevent="addLetter('y')">{{ letter('y') }}</button>
        <button @click.prevent="addLetter('u')">{{ letter('u') }}</button>
        <button @click.prevent="addLetter('i')">{{ letter('i') }}</button>
        <button @click.prevent="addLetter('o')">{{ letter('o') }}</button>
        <button @click.prevent="addLetter('p')">{{ letter('p') }}</button>
        <button @click.prevent="addLetter('[')">{{ letter('[') }}</button>
        <button @click.prevent="addLetter(']')">{{ letter(']') }}</button>
      </div>
      <div class="keyboard-row keyboard-row-3">
        <button @click.prevent="capsPressed = !capsPressed" :class="{ 'active': capsPressed }" >Caps</button>
        <button @click.prevent="addLetter('a')">{{ letter('a') }}</button>
        <button @click.prevent="addLetter('s')">{{ letter('s') }}</button>
        <button @click.prevent="addLetter('d')">{{ letter('d') }}</button>
        <button @click.prevent="addLetter('e')">{{ letter('e') }}</button>
        <button @click.prevent="addLetter('f')">{{ letter('f') }}</button>
        <button @click.prevent="addLetter('g')">{{ letter('g') }}</button>
        <button @click.prevent="addLetter('h')">{{ letter('h') }}</button>
        <button @click.prevent="addLetter('i')">{{ letter('i') }}</button>
        <button @click.prevent="addLetter('j')">{{ letter('j') }}</button>
        <button @click.prevent="addLetter('k')">{{ letter('k') }}</button>
        <button @click.prevent="addLetter('l')">{{ letter('l') }}</button>
        <button @click.prevent="addSymbol(';')">{{ symbol(';') }}</button>
        <button @click.prevent="addSymbol('\'')">{{ symbol('\'') }}</button>
        <button @click.prevent="addSymbol('\\')">{{ symbol('\\') }}</button>
      </div>
      <div class="keyboard-row keyboard-row-4">
        <button @click.prevent="shiftPressed = !shiftPressed" :class="{ 'active': shiftPressed }" >Shift</button>
        <button @click.prevent="addLetter('z')">{{ letter('z') }}</button>
        <button @click.prevent="addLetter('x')">{{ letter('x') }}</button>
        <button @click.prevent="addLetter('c')">{{ letter('c') }}</button>
        <button @click.prevent="addLetter('v')">{{ letter('v') }}</button>
        <button @click.prevent="addLetter('b')">{{ letter('b') }}</button>
        <button @click.prevent="addLetter('n')">{{ letter('n') }}</button>
        <button @click.prevent="addLetter('m')">{{ letter('m') }}</button>
        <button @click.prevent="addSymbol(',')">{{ symbol(',') }}</button>
        <button @click.prevent="addSymbol('.')">{{ symbol('.') }}</button>
        <button @click.prevent="addSymbol('/')">{{ symbol('/') }}</button>
        <button @click.prevent="shiftPressed = !shiftPressed" :class="{ 'active': shiftPressed }" >Shift</button>
      </div>
      <div class="keyboard-row keyboard-row-5">
        <button></button>
        <button @click.prevent="txt += ' '" class="spacebar"></button>
        <button></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'keyboard',
  props: ['visible'],
  data () {
    return {
      txt: '',
      shiftPressed: false,
      capsPressed: false
    }
  },
  computed: {
    capitalized () {
      return (this.shiftPressed || this.capsPressed || this.txt.length === 0)
    }
  },
  methods: {
    removeLastChar () {
      this.txt = this.txt.substr(0, this.txt.length - 1)
    },
    addLetter (k) {
      this.txt += this.letter(k)

      // if shift is pressed, unshift now
      if (this.shiftPressed) {
        this.shiftPressed = false
      }
    },
    letter (l) {
      return (this.capitalized) ? l.toUpperCase() : l.toLowerCase()
    },
    addSymbol (k) {
      this.txt += this.symbol(k)

      // if shift is pressed, unshift now
      if (this.shiftPressed) {
        this.shiftPressed = false
      }
    },
    submitText () {
      this.$emit('submitted', { text: this.txt, visible: false })
      this.txt = ''
      this.shiftPressed = false
      this.capsPressed = false
    },
    symbol (l) {
      if (l === '1') {
        return (!this.shiftPressed) ? '1' : '!'
      }

      if (l === '2') {
        return (!this.shiftPressed) ? '2' : '@'
      }

      if (l === '3') {
        return (!this.shiftPressed) ? '3' : '#'
      }

      if (l === '4') {
        return (!this.shiftPressed) ? '4' : '$'
      }

      if (l === '5') {
        return (!this.shiftPressed) ? '5' : '%'
      }

      if (l === '6') {
        return (!this.shiftPressed) ? '6' : '^'
      }

      if (l === '7') {
        return (!this.shiftPressed) ? '7' : '&'
      }

      if (l === '8') {
        return (!this.shiftPressed) ? '8' : '*'
      }

      if (l === '9') {
        return (!this.shiftPressed) ? '9' : '('
      }

      if (l === '0') {
        return (!this.shiftPressed) ? '0' : ')'
      }

      if (l === '-') {
        return (!this.shiftPressed) ? '-' : '_'
      }

      if (l === '=') {
        return (!this.shiftPressed) ? '=' : '+'
      }

      if (l === ';') {
        return (!this.shiftPressed) ? ';' : ':'
      }

      if (l === '\'') {
        return (!this.shiftPressed) ? '\'' : '"'
      }

      if (l === '\\') {
        return (!this.shiftPressed) ? '\\' : '|'
      }

      if (l === ',') {
        return (!this.shiftPressed) ? ',' : '<'
      }

      if (l === '.') {
        return (!this.shiftPressed) ? '.' : '>'
      }

      if (l === '/') {
        return (!this.shiftPressed) ? '/' : '?'
      }
    }
  }
}
</script>

<style>
.keyboard {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 99;
  background: red;
}

.exampleText {
  flex: 0 0 80%;
}

.keyboard-row {
  display: flex;
}

.keyboard-row button {
  flex: 1;
  height: 55px;
  margin: .1rem;
}

.keyboard-row .spacebar {
  flex: 0 0 80%;
}
</style>
