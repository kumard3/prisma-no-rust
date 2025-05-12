// const OptionSelector: React.FC<VariantSelectorProps> = ({ variants }) => {
//   // Base state for required hand selection
//   const [selectedHand, setSelectedHand] = useState<Hand | null>(null);
//   // Dynamic states for optional fields
//   const [selections, setSelections] = useState<Selections>({});
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
//     null,
//   );
//   const [metaDetails, setMetaDetails] = useState<MetaDetails>({
//     variant: null,
//     selections: { hand: null },
//   });

//   // Get unique hands from variants (required field)
//   const uniqueHands = uniq(variants?.map((variant) => variant.hand));

//   // Function to check if a field exists in variants and has non-null values
//   const doesFieldExist = (fieldName: keyof ProductVariant): boolean => {
//     return some(variants, (variant) => {
//       const value = variant[fieldName];
//       return (
//         value !== null &&
//         value !== undefined &&
//         value !== "" &&
//         (Array.isArray(value) ? value.length > 0 : true)
//       );
//     });
//   };

//   // Function to get filtered variants based on current selections
//   const getFilteredVariants = (): ProductVariant[] => {
//     return variants?.filter((variant) => {
//       if (!selectedHand) return true;

//       // Check hand match (required)
//       if (variant.hand !== selectedHand) return false;

//       // Check all other selections
//       return every(Object.entries(selections), ([field, selectedValue]) => {
//         if (
//           !selectedValue ||
//           (Array.isArray(selectedValue) && selectedValue.length === 0)
//         ) {
//           return true;
//         }

//         const variantValue = variant[field as keyof ProductVariant];

//         if (Array.isArray(selectedValue)) {
//           // For array fields (like trajectory, spin, etc.)
//           return selectedValue.every(
//             (value) =>
//               Array.isArray(variantValue) && variantValue.includes(value),
//           );
//         } else {
//           // For single value fields (like loft, lie)
//           return variantValue === selectedValue;
//         }
//       });
//     });
//   };

//   // Function to get available options for a field based on current selections
//   const getAvailableOptions = (field: keyof ProductVariant): string[] => {
//     const filteredVariants = getFilteredVariants();
//     const values = filteredVariants
//       .map((variant) => variant[field])
//       .filter(Boolean);

//     if (Array.isArray(values[0])) {
//       return uniq(values.flat() as string[]);
//     }
//     return uniq(values as string[]);
//   };

//   // Handle selection changes
//   const handleSelection = (
//     field: string,
//     value: string,
//     isMultiple = false,
//   ) => {
//     setSelections((prev) => ({
//       ...prev,
//       [field]: isMultiple
//         ? (prev[field] as string[])?.[0] === value
//           ? []
//           : [value]
//         : value,
//     }));
//   };

//   // Reset all selections except hand
//   const resetSelections = (hand: Hand) => {
//     setSelectedHand(hand);
//     setSelections({});
//     setSelectedVariant(null);
//   };

//   // Update meta details when selections change
//   useEffect(() => {
//     if (selectedHand) {
//       const filteredVariants = getFilteredVariants();
//       const matchingVariant = filteredVariants[0];

//       setSelectedVariant(matchingVariant);
//       setMetaDetails({
//         variant: matchingVariant,
//         selections: {
//           hand: selectedHand,
//           ...selections,
//         },
//       });
//     }
//   }, [selectedHand, selections]);

//   // Function to render a selection section
//   const renderSelectionSection = (
//     title: string,
//     field: keyof ProductVariant,
//     isMultiple = false,
//   ) => {
//     if (!doesFieldExist(field)) return null;

//     const options = getAvailableOptions(field);
//     if (!options || options.length === 0) return null;

//     const currentSelection = selections[field] ?? (isMultiple ? [] : null);
//     console.log(currentSelection, "currentSelection");
//     console.log(options, "options");
//     return (
//       <>
//         {/* <OptionButtons
//             mainLabel={title}
//             options={options.map((option) => ({
//               value: option,
//               label: option,
//             }))}
//             value={currentSelection}
//             onChange={(value) => handleSelection(field, value, isMultiple)}
//           /> */}
//         <div className="space-y-4">
//           <h2 className="text-2xl font-semibold">{title}</h2>
//           <div className="flex flex-wrap gap-4">
//             {options.map((option) => (
//               <Button
//                 key={option}
//                 onClick={() => handleSelection(field, option, isMultiple)}
//                 className={`rounded-lg border-2 px-6 py-3 ${
//                   isMultiple
//                     ? (currentSelection as string[])?.includes(option)
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200"
//                     : currentSelection === option
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200"
//                 }`}
//               >
//                 {option}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="mx-auto max-w-4xl p-6">
//       {/* Hand Selection (Required) */}
//       <div className="space-y-4">
//         <h2 className="text-2xl font-semibold">Hand</h2>
//         <div className="flex gap-4">
//           {uniqueHands?.map((hand) => (
//             <button
//               key={hand}
//               onClick={() => resetSelections(hand)}
//               className={`rounded-lg border-2 px-6 py-3 ${
//                 selectedHand === hand
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-200"
//               }`}
//             >
//               {hand}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Only show other selections if hand is selected */}
//       {selectedHand && (
//         <>
//           {/* Priority fields (if they exist) */}
//           {renderSelectionSection("Lie", "lie", false)}
//           {renderSelectionSection("Loft", "loft", false)}

//           {/* Other optional fields */}
//           {renderSelectionSection("Trajectory", "trajectory", true)}
//           {renderSelectionSection("Spin", "spin", true)}
//           {renderSelectionSection("Player Type", "playerType", true)}
//           {renderSelectionSection("Color", "color", true)}
//           {renderSelectionSection("Finish", "finish", true)}
//           {renderSelectionSection("Launch", "launch", true)}
//           {renderSelectionSection("Performance", "performance", true)}
//           {renderSelectionSection("Special Type", "specialType", true)}
//         </>
//       )}

//       {/* Meta Details Display */}
//       {selectedVariant && (
//         <div className="mt-8 rounded-lg bg-gray-50 p-4">
//           <h3 className="mb-2 text-lg font-semibold">
//             Selected Configuration:
//           </h3>
//           <pre className="whitespace-pre-wrap">
//             {JSON.stringify(metaDetails, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

import React from "react";

export default function Page() {
  return <div>Page</div>;
}
