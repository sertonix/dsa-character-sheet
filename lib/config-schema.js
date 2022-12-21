export const configSchema = {
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
  "dsa.theme": {
    type: "string",
    default: "dsa-theme:black-and-white",
  },
};
