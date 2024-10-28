import { ConfigFileOptions, EmitModes, TypeModel, Modes } from "@odata2ts/odata2ts";

export default {
  emitMode: EmitModes.ts,
  mode: Modes.models,
  services: {
    dynamics: {
      serviceName: "dynamics",
      source: "ODataV4Metadata.xml",
      output: "generated/dynamics",
      // absolutely needed when confronted with huge EDMX files!
      bundledFileGeneration: false,
      byTypeAndName: [
        /**
         * There's an EntityTpe with name "solution" and a ComplexType with name "Solution".
         * This edge case is not handled correctly by odata2ts for now.
         *
         * Workaround: Rename one of those names which only differ in casing of the first letter.
         */
        {
          type: TypeModel.ComplexType,
          name: "Solution",
          mappedName: "SolutionCT",
        },
        /**
         * A hyphen won't work as part of a valid class name.
         * odata2ts should throw a proper error message here, but currently doesn't.
         *
         * Workaround: Rename offending names without usage of the hyphen
         */
        {
          type: TypeModel.OperationImportType,
          name: "cat_Sendin-appnotification",
          mappedName: "cat_Sendin_appnotification",
        },
        {
          type: TypeModel.OperationType,
          name: "cat_Sendin-appnotification",
          mappedName: "cat_Sendin_appnotification",
        },
        /**
         * Reserved words like "import" won't work.
         * odata2ts should throw a proper error message here, but currently doesn't.
         *
         * Workaround: Rename offending names
         */
        {
          type: TypeModel.EntityType,
          name: "import",
          mappedName: "importType",
        },
        {
          type: TypeModel.EntityType,
          name: "package",
          mappedName: "packageType",
        },
      ],
    },
  },
} satisfies ConfigFileOptions;
