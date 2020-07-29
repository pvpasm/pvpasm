<template>
  <div id="main-container">
    <div id="left-container">
      <div id="graph-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          baseProfile="full"
          id="graph-view"
          width="2000px"
          height="2500px"
        >
          <defs>
            <marker
              id="graph-red-arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="0"
              refY="2"
              orient="auto"
              class="graph-arrowhead"
            >
              <polygon points="0 0.5, 2.5 2, 0 3.5" />
            </marker>
          </defs>
          <defs>
            <marker
              id="graph-green-arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="0"
              refY="2"
              orient="auto"
              class="graph-arrowhead"
            >
              <polygon points="0 0.5, 2.5 2, 0 3.5" />
            </marker>
          </defs>
          <defs>
            <marker
              id="graph-blue-arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="0"
              refY="2"
              orient="auto"
              class="graph-arrowhead"
            >
              <polygon points="0 0.5, 2.5 2, 0 3.5" />
            </marker>
          </defs>
        </svg>
      </div>
      <div id="left-horizontal-dragbar"></div>
      <div id="control-box">
        <div id="status-msg-box">
          <div id="status-msg-content"></div>
        </div>

        <div id="ctrl-btns">
          <i class="fas fa-step-backward i-btn level-config"></i>
          <i id="level-category" class="fas fa-baby i-btn level-config"></i>
          <p id="level-num" class="level-config">1</p>
          <i class="fas fa-step-forward i-btn level-config"></i>

          <select name="lang" id="lang-select" class="level-config">
            <option value="x86">x86</option>
            <option value="arm">arm</option>
            <option value="mips">mips</option>
          </select>

          <i class="fas fa-spinner fa-spin" id="spinner-submit"></i>
          <i class="fas fa-upload i-btn" id="btn-submit"></i>
        </div>
      </div>
    </div>
    <div id="vertical-dragbar"></div>
    <div id="right-container">
      <div id="notes-box">
        <textarea id="notes-area">// Notes here</textarea>
      </div>
      <div id="right-horizontal-dragbar"></div>
      <div id="code-editor-box">
        <div id="code-editor"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Practice"
});
</script>

<style>
</style>
