// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import { VFileUpload } from "vuetify/labs/VFileUpload";

export default createVuetify({
  components: { VFileUpload },
  defaults: {
    VCard: {
      outlined: true,
    },
    theme: {
      dark: false,
      colors: {
        primary: "#1976D2",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
