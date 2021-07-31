export default {
  methods: {
    generateLabelingTemplateLink (dataset) {
      switch (dataset.Type) {
        case 1:
          return `/labeling/grid/${dataset.Id}`
        case 2:
        default:
          return  `/labeling/sentiment/${dataset.Id}`
      }
    }
  }
}
