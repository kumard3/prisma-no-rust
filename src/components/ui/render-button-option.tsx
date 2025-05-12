// function RenderOptionButtons({
//   keyName,
//   label,
//   queryResults,
//   handler,
//   product,
//   configuration,
//   isOptionDisabled,
// }: {
//   keyName: keyof QueryResultsType;
//   label: string;
//   handler?: (value: string) => void;
//   queryResults: QueryResultsType;
//   product: ExtendedProductVariant | undefined;
//   configuration: ProductConfiguration;
//   isOptionDisabled: (key: keyof ProductVariant, value: string) => boolean;
// }) {
//   const [selectedValue, setSelectedValue] = useState<string>("");
//   useEffect(() => {
//     if (product && keyName in configuration && queryResults[keyName]?.length) {
//       const selectedValue = Array.isArray(configuration[keyName])
//         ? configuration[keyName].join(", ")
//         : (configuration[keyName] ?? "");
//       setSelectedValue(selectedValue);
//     }
//   }, [configuration, keyName, product, queryResults]);

//   if (product && keyName in configuration && queryResults[keyName]?.length) {
//     return (
//       <OptionButtons
//         mainLabel={label}
//         options={queryResults[keyName].map((opt) => ({
//           value: opt.id,
//           label: opt.label,
//         }))}
//         value={selectedValue}
//         onChange={(value: string) => {
//           if (handler) {
//             handler(value);
//           }
//         }}
//         keyName={keyName}
//         isOptionDisabled={isOptionDisabled}
//       />
//     );
//   }
//   return null;
// }

import React from "react";

export default function Index() {
  return <div>Index</div>;
}
