export const dataSchema = {
  "dsa.plugins": {
    type: "array",
    items: {
      type: "string",
      required: true,
    },
    default: [],
  },
  "dsa.plugins.default-enabled": {
    type: "boolean",
    default: true,
  },
  "dsa.plugins.offline-files": {
    type: "object",
    default: Object.create(null),
  },
  "dsa.theme": {
    type: "string",
    default: "dsa-theme:black-and-white",
  },
};
