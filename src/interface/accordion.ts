type AccordionName =
  | 'warehouse'
  | 'product'
  | 'relationship'
  | 'assignedProduct'
  | 'user'
  | 'listingStatus'
  | 'mappings'
  | 'defaultPropertyValue'
  | 'order'
  | 'productCategoryMappings'
  | 'productPropertyMappings'
  | 'courierMappings'
  | 'deliveryTypeMappings'

interface IAccordion extends Record<AccordionName, string> {}

export type {AccordionName, IAccordion}
