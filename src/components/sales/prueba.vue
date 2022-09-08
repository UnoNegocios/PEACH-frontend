<template>
    <div id="app">
        <v-data-table :headers="headers" 
            :items="desserts"
            sort-by="calories" 
            v-sortable-table="{onEnd:sortTheHeadersAndUpdateTheKey}"
            :key="anIncreasingNumber">
        </v-data-table>
    </div>
</template>

<script>
    // Add back the sortHandle class if it gets stripped away by external code
function watchClass(targetNode, classToWatch) {
  let lastClassState = targetNode.classList.contains(classToWatch);
  const observer = new MutationObserver((mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
      const mutation = mutationsList[i];
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const currentClassState = mutation.target.classList.contains(classToWatch);
        if (lastClassState !== currentClassState) {
          lastClassState = currentClassState;
          if (!currentClassState) {
            mutation.target.classList.add('sortHandle');
          }
        }
      }
    }
  });
  observer.observe(targetNode, { attributes: true });
}

new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
        anIncreasingNumber: 1,
    }),
    methods: {
        sortTheHeadersAndUpdateTheKey(evt) {
            const headersTmp = this.headers;
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;
            if (newIndex >= headersTmp.length) {
                let k = newIndex - headersTmp.length + 1;
                while (k--) {
                    headersTmp.push(undefined);
                }
            }
            headersTmp.splice(newIndex, 0, headersTmp.splice(oldIndex, 1)[0]);
            this.table = headersTmp;
            this.anIncreasingNumber += 1;
        },
  },
    directives: {
        'sortable-table': {
            inserted: (el, binding) => {
                el.querySelectorAll('th').forEach((draggableEl) => {
                    // Need a class watcher because sorting v-data-table rows asc/desc removes the sortHandle class
                    watchClass(draggableEl, 'sortHandle');
                    draggableEl.classList.add('sortHandle');
                });
                Sortable.create(el.querySelector('tr'), binding.value ? { ...binding.value, handle: '.sortHandle' } : {});
            },
        },
    },
});

</script>
