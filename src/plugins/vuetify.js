import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme: {
      themes: {
        dark: {
          primary: colors.purple,
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red.accent3,
        },
        light: {
          primary: colors.purple,
        },
      },
    },
  })

export default vuetify /*new Vuetify({
});*/
