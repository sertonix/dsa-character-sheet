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
    default: {},
  },
  "dsa.theme": {
    type: "string",
    default: "dark-minimal",
  },
};
