// stores/scriptStore.js
import { defineStore } from "pinia";
import { scripts } from "@/stores/scriptsConfig.js";

export const useScriptStore = defineStore("script", {
  state: () => ({
    loadedScripts: {},
  }),
  actions: {
    loadScript(scriptName, scriptSource) {
      const scriptId = `script-${scriptName}`;
      if (this.loadedScripts[scriptId]) {
        console.log("Script already loaded:", scriptName);
        return; // Script already loaded
      }
      let script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptSource;
      script.onload = () => {
        this.loadedScripts[scriptId] = true;
      };
      document.head.appendChild(script);
    },
    loadAllScripts() {
      scripts.forEach((script) => {
        this.loadScript(script.name, script.src);
      });
    },
  },
});
