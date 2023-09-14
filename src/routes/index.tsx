import React, {useContext} from 'react'
import {useRoutes} from 'react-router-dom'
import {
  VerticalLayout,
  HorizontalLayout,
  DetachedLayout,
  FullLayout,
} from '../layouts'
import {LayoutTypes, ROUTE_PARAMS} from '../constants'
import {GlobalContext} from '../store/GlobalContext'
import {PERMISSIONS} from '../constants/permissions'
import LoadComponent from './LoadComponent'

const EmptyPage = React.lazy(() => import('../pages/EmptyPage/EmptyPage'))

const Organizations = React.lazy(
  () => import('../pages/Organization/Organizations')
)
const UpdateOrganizations = React.lazy(
  () => import('../pages/Organization/UpdateOrganizations')
)

const OrganizationSite = React.lazy(
  () => import('../pages/OrganizationSite/OrganizationSite')
)
const UpdateOrganizationSite = React.lazy(
  () => import('../pages/OrganizationSite/UpdateOrganizationSite')
)

const ViewSiteLocales = React.lazy(
  () => import('../pages/SiteLocales/ViewSiteLocales')
)
const UpdateSiteLocale = React.lazy(
  () => import('../pages/SiteLocales/UpdateSiteLocale')
)
const Warehouse = React.lazy(() => import('../pages/Warehouse/Warehouse'))
const EditWarehouse = React.lazy(
  () => import('../pages/Warehouse/EditWarehouse/EditWarehouse')
)
const Products = React.lazy(() => import('../pages/Products/Products'))

const ProductDetail = React.lazy(
  () => import('../pages/Products/ProductDetail')
)

// const ViewAssignedResources = React.lazy(
//   () => import('../pages/AssignedResource/ViewAssignedResources')
// )
// const UpdateAssignedResource = React.lazy(
//   () => import('../pages/AssignedResource/UpdateAssignedResource')
// )
// const Users = React.lazy(() => import('../pages/Users/Users'))
// const UpdateUser = React.lazy(
//   () => import('../pages/Users/UpdateUser/UpdateUser')
// )

// const Aggregators = React.lazy(() => import('../pages/Aggregator/Aggregators'))
// const UpdateAggregators = React.lazy(
//   () => import('../pages/Aggregator/UpdateAggregators')
// )

const Marketplaces = React.lazy(
  () => import('../pages/Marketplace/Marketplaces')
)
const UpdateMarketplaces = React.lazy(
  () => import('../pages/Marketplace/UpdateMarketplaces')
)
const MarketplaceRelationships = React.lazy(
  () => import('../pages/MarketplaceRelationship/Relationships')
)
const UpdateMarketplaceRelationships = React.lazy(
  () => import('../pages/MarketplaceRelationship/UpdateRelationships')
)

// const RelationshipAMs = React.lazy(
//   () => import('../pages/RelationshipAM/RelationshipAM')
// )
// const UpdateRelationshipAM = React.lazy(() => import('../pages/RelationshipAM/UpdateRelationshipAM'))

const AssignedProduct = React.lazy(
  () => import('../pages/AssignedProduct/AssignedProduct')
)

const Orders = React.lazy(() => import('../pages/Order/Orders'))
const OrderDetail = React.lazy(() => import('../pages/Order/OrderDetail'))

const ListingStatus = React.lazy(
  () => import('../pages/ListingStatus/ListingStatus')
)

const ProductProperties = React.lazy(
  () => import('../pages/ProductProperties/ProductProperties')
)
const UpdateProductProperty = React.lazy(
  () => import('../pages/ProductProperties/UpdateProductProperty')
)

const DefaultPropertyValues = React.lazy(
  () => import('../pages/DefaultPropertyValue/DefaultPropertyValues')
)
const AddDefaultPropertyValue = React.lazy(
  () => import('../pages/DefaultPropertyValue/UpdateDefaultPropertyValue')
)
const EditDefaultPropertyValue = React.lazy(
  () => import('../pages/DefaultPropertyValue/UpdateDefaultPropertyValue')
)

const ProductCategoryMappings = React.lazy(
  () => import('../pages/ProductCategoryMappings/ListProductCategoryMappings')
)
const AddProductCategoryMappings = React.lazy(
  () => import('../pages/ProductCategoryMappings/AddProductCategoryMapping')
)
const EditProductCategoryMappings = React.lazy(
  () => import('../pages/ProductCategoryMappings/EditProductCategoryMapping')
)

const ProductPropertyMappings = React.lazy(
  () => import('../pages/ProductPropertyMappings/ListProductPropertyMappings')
)
const AddProductPropertyMappings = React.lazy(
  () => import('../pages/ProductPropertyMappings/AddProductPropertyMappings')
)
const EditProductPropertyMappings = React.lazy(
  () => import('../pages/ProductPropertyMappings/EditProductPropertyMappings')
)

const ValueMappings = React.lazy(
  () => import('../pages/ValueMappings/ValueMappings')
)

const CourierMappings = React.lazy(
  () => import('../pages/CourierMappings/ListCourierMappings')
)
const AddCourierMappings = React.lazy(
  () => import('../pages/CourierMappings/UpdateCourierMappings')
)
const EditCourierMappings = React.lazy(
  () => import('../pages/CourierMappings/UpdateCourierMappings')
)

const ImportProductProperties = React.lazy(
  () => import('../pages/ImportProductProperties/ImportProductProperties')
)
const ImportResult = React.lazy(
  () => import('../pages/ImportProductProperties/ImportResult')
)

const ReturnRefund = React.lazy(
  () => import('../pages/ReturnRefund/ReturnRefund')
)

const DeliveryTypeMappings = React.lazy(
  () => import('../pages/DeliveryTypeMappings/ListDeliveryTypeMappings')
)
const AddDeliveryTypeMappings = React.lazy(
  () => import('../pages/DeliveryTypeMappings/UpdateDeliveryTypeMappings')
)
const EditDeliveryTypeMappings = React.lazy(
  () => import('../pages/DeliveryTypeMappings/UpdateDeliveryTypeMappings')
)

const PermissionDenied = React.lazy(
  () => import('../pages/PermissionDenied/PermissionDenied')
)

const AllRoutes = () => {
  const {
    state: {layout},
  } = useContext(GlobalContext)

  const getLayout = () => {
    switch (layout.layoutType) {
      case LayoutTypes.LAYOUT_HORIZONTAL:
        return HorizontalLayout
      case LayoutTypes.LAYOUT_DETACHED:
        return DetachedLayout
      case LayoutTypes.LAYOUT_FULL:
        return FullLayout
      default:
        return VerticalLayout
    }
  }
  let Layout = getLayout()

  const localeRoutes = {
    path: 'locales',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={ViewSiteLocales}
            permissions={[
              PERMISSIONS.view_organization_list,
              PERMISSIONS.view_site_list,
              PERMISSIONS.view_site_locale_list,
            ]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={UpdateSiteLocale}
            permissions={[
              PERMISSIONS.view_organization_list,
              PERMISSIONS.view_site_list,
              PERMISSIONS.add_locale,
            ]}
          />
        ),
      },
      {
        path: ROUTE_PARAMS.SITE_LOCALE_ID,
        element: (
          <LoadComponent
            component={UpdateSiteLocale}
            permissions={[
              PERMISSIONS.view_organization_list,
              PERMISSIONS.view_site_list,
              PERMISSIONS.view_site_locale_list,
            ]}
          />
        ),
      },
    ],
  }

  const siteRoutes = {
    path: 'sites',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={OrganizationSite}
            permissions={[
              PERMISSIONS.view_organization_list,
              PERMISSIONS.view_site_list,
            ]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={UpdateOrganizationSite}
            permissions={[
              PERMISSIONS.view_organization_list,
              PERMISSIONS.add_site,
            ]}
          />
        ),
      },
      {
        path: ROUTE_PARAMS.SITE_ID,
        children: [
          {
            path: '',
            element: (
              <LoadComponent
                component={UpdateOrganizationSite}
                permissions={[
                  PERMISSIONS.view_organization_list,
                  PERMISSIONS.view_site_list,
                ]}
              />
            ),
          },
          localeRoutes,
        ],
      },
    ],
  }

  const organizationRoutes = {
    path: '/organizations',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={Organizations}
            permissions={[PERMISSIONS.view_organization_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={UpdateOrganizations}
            permissions={[PERMISSIONS.add_org]}
          />
        ),
      },
      {
        path: ROUTE_PARAMS.ORG_ID,
        children: [
          {
            path: '',
            element: (
              <LoadComponent
                component={UpdateOrganizations}
                permissions={[PERMISSIONS.view_organization_list]}
              />
            ),
          },
          siteRoutes,
        ],
      },
    ],
  }

  const warehouseRoutes = {
    path: '/warehouses',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={Warehouse}
            permissions={[PERMISSIONS.view_warehouse_list]}
          />
        ),
      },
      {
        path: ROUTE_PARAMS.WAREHOUSE_ID,
        element: (
          <LoadComponent
            component={EditWarehouse}
            permissions={[PERMISSIONS.view_warehouse_list]}
          />
        ),
      },
    ],
  }

  const productRoutes = {
    path: '/products',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={Products}
            permissions={[PERMISSIONS.view_product_list]}
          />
        ),
      },
      {
        path: `detail/${ROUTE_PARAMS.PRODUCT_ID}`,
        element: (
          <LoadComponent
            component={ProductDetail}
            permissions={[PERMISSIONS.view_product_list]}
          />
        ),
      },
    ],
  }

  const orderRoutes = {
    path: '/orders',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={Orders}
            permissions={[PERMISSIONS.view_order_list]}
          />
        ),
      },
      {
        path: `detail/${ROUTE_PARAMS.ORDER_ID}`,
        element: (
          <LoadComponent
            component={OrderDetail}
            permissions={[PERMISSIONS.view_order_list]}
          />
        ),
      },
    ],
  }

  const returnRefundRoutes = {
    path: '/returnrefund',
    children: [
      {
        path: '',
        element: <LoadComponent component={ReturnRefund} />,
      },
    ],
  }

  const listingStatusRoutes = {
    path: '/listing-status',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={ListingStatus}
            permissions={[PERMISSIONS.view_listing_status]}
          />
        ),
      },
    ],
  }

  const marketplaceRoutes = {
    path: '/marketplaces',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={Marketplaces}
            permissions={[PERMISSIONS.view_marketplace_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={UpdateMarketplaces}
            permissions={[PERMISSIONS.add_marketplace]}
          />
        ),
      },
      {
        path: ROUTE_PARAMS.MARKETPLACE_ID,
        children: [
          {
            path: '',
            element: (
              <LoadComponent
                component={UpdateMarketplaces}
                permissions={[PERMISSIONS.view_marketplace_list]}
              />
            ),
          },
        ],
      },
    ],
  }

  const marketplaceRelationshipRoutes = {
    path: '/marketplace-relationships',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={MarketplaceRelationships}
            permissions={[PERMISSIONS.view_marketplace_relationship_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={UpdateMarketplaceRelationships}
            permissions={[PERMISSIONS.add_marketplace_relationship]}
          />
        ),
      },
      {
        path: ROUTE_PARAMS.MARKETPLACE_RELATIONSHIP_ID,
        element: (
          <LoadComponent
            component={UpdateMarketplaceRelationships}
            permissions={[PERMISSIONS.view_marketplace_relationship_list]}
          />
        ),
      },
    ],
  }

  const assignedProductRoutes = {
    path: '/assigned-products',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={AssignedProduct}
            permissions={[PERMISSIONS.view_assign_products_to_marketplaces]}
          />
        ),
      },
    ],
  }

  const productPropertyRoutes = {
    path: '/product-properties',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={ProductProperties}
            permissions={[PERMISSIONS.view_product_property_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={UpdateProductProperty}
            permissions={[PERMISSIONS.add_product_property]}
          />
        ),
      },
      {
        path: `edit/${ROUTE_PARAMS.PRODUCT_PROPERTY_ID}`,
        element: (
          <LoadComponent
            component={UpdateProductProperty}
            permissions={[PERMISSIONS.view_product_property_list]}
          />
        ),
      },
    ],
  }

  const defaultPropertyValueRoutes = {
    path: '/default-property-value',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={DefaultPropertyValues}
            permissions={[PERMISSIONS.view_default_property_value_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={AddDefaultPropertyValue}
            permissions={[PERMISSIONS.add_default_property_value]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.DEFAULT_PROPERTY_VALUE_ID}`,
        element: (
          <LoadComponent
            component={EditDefaultPropertyValue}
            permissions={[PERMISSIONS.view_default_property_value_list]}
          />
        ),
      },
    ],
  }

  const productPropertyMappingsRoute = {
    path: '/product-property-mappings',
    children: [
      {
        path: '',
        index: true,
        element: (
          <LoadComponent
            component={ProductPropertyMappings}
            key='productPropertyMappings'
            permissions={[PERMISSIONS.view_product_category_mapping_list]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}`,
        element: (
          <LoadComponent
            component={ProductPropertyMappings}
            key='marketplaceProductCategories'
            permissions={[PERMISSIONS.view_product_category_mapping_list]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}/add`,
        element: (
          <LoadComponent
            component={AddProductPropertyMappings}
            permissions={[PERMISSIONS.view_product_category_mapping_list]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}/${ROUTE_PARAMS.PRODUCT_PROPERTY_ATTRIBUTE_ID}`,
        element: (
          <LoadComponent
            component={EditProductPropertyMappings}
            permissions={[PERMISSIONS.view_product_category_mapping_list]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.MARKETPLACE_TYPE_ID}/${ROUTE_PARAMS.MAPPING_TARGET_ID}/${ROUTE_PARAMS.PRODUCT_PROPERTY_ATTRIBUTE_ID}/value-mappings`,
        element: (
          <LoadComponent
            component={ValueMappings}
            permissions={[PERMISSIONS.view_product_category_mapping_list]}
          />
        ),
      },
    ],
  }

  const productCategoryMappingsRoutes = {
    path: '/product-category-mappings',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={ProductCategoryMappings}
            permissions={[PERMISSIONS.view_product_category_mapping_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={AddProductCategoryMappings}
            permissions={[PERMISSIONS.add_product_category_mapping]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.PRODUCT_CATEGORY_MAPPINGS_ID}`,
        element: (
          <LoadComponent
            component={EditProductCategoryMappings}
            permissions={[PERMISSIONS.view_product_category_mapping_list]}
          />
        ),
      },
    ],
  }

  const courierMappingsRoutes = {
    path: '/courier-mappings',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={CourierMappings}
            permissions={[PERMISSIONS.view_courier_mapping_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={AddCourierMappings}
            permissions={[PERMISSIONS.add_courier_mapping]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.COURIER_MAPPING_ID}`,
        element: (
          <LoadComponent
            component={EditCourierMappings}
            permissions={[PERMISSIONS.view_courier_mapping_list]}
          />
        ),
      },
    ],
  }

  const importProductPropertiesRoutes = {
    path: '/import-product-properties',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={ImportProductProperties}
            permissions={[PERMISSIONS.add_product_property]}
          />
        ),
      },
      {
        path: 'result',
        element: (
          <LoadComponent
            component={ImportResult}
            permissions={[PERMISSIONS.add_product_property]}
          />
        ),
      },
    ],
  }

  const deliveryTypeMappingsRoutes = {
    path: '/delivery-type-mappings',
    children: [
      {
        path: '',
        element: (
          <LoadComponent
            component={DeliveryTypeMappings}
            permissions={[PERMISSIONS.view_delivery_mapping_list]}
          />
        ),
      },
      {
        path: 'add',
        element: (
          <LoadComponent
            component={AddDeliveryTypeMappings}
            permissions={[PERMISSIONS.add_delivery_mapping]}
          />
        ),
      },
      {
        path: `${ROUTE_PARAMS.DELIVERY_TYPE_MAPPING_ID}`,
        element: (
          <LoadComponent
            component={EditDeliveryTypeMappings}
            permissions={[PERMISSIONS.view_delivery_mapping_list]}
          />
        ),
      },
    ],
  }

  // const resourceRoutes = {
  //   path: 'resources',
  //   children: [
  //     {
  //       path: '',
  //       element: <LoadComponent component={ViewAssignedResources} />,
  //     },
  //     {
  //       path: 'add',
  //       element: <LoadComponent component={UpdateAssignedResource} />,
  //     },
  //     {
  //       path: ROUTE_PARAMS.RESOURCE_ID,
  //       children: [
  //         {
  //           path: '',
  //           element: <LoadComponent component={UpdateAssignedResource} />,
  //         },
  //       ],
  //     },
  //   ],
  // }

  // const userRoutes = {
  //   path: '/users',
  //   children: [
  //     {
  //       path: '',
  //       element: <LoadComponent component={Users} />,
  //     },
  //     {
  //       path: 'add',
  //       element: <LoadComponent component={UpdateUser} />,
  //     },
  //     {
  //       path: ROUTE_PARAMS.USER_ID,
  //       children: [
  //         {
  //           path: '',
  //           element: <LoadComponent component={UpdateUser} />,
  //         },
  //         resourceRoutes,
  //       ],
  //     },
  //   ],
  // }

  // const aggregatorRoutes = {
  //   path: '/aggregators',
  //   children: [
  //     {
  //       path: '',
  //       element: <LoadComponent component={Aggregators} />,
  //     },
  //     {
  //       path: 'add',
  //       element: <LoadComponent component={UpdateAggregators} />,
  //     },
  //     {
  //       path: ROUTE_PARAMS.AGGREGATOR_ID,
  //       children: [
  //         {
  //           path: '',
  //           element: <LoadComponent component={UpdateAggregators} />,
  //         },
  //       ],
  //     },
  //   ],
  // }

  // const aggregatorMarketplaceRelationshipRoutes = {
  //   path: '/relationshipAMs',
  //   children: [
  //     {
  //       path: '',
  //       element: <LoadComponent component={RelationshipAMs} />,
  //     },
  //     {
  //       path: 'add',
  //       element: <LoadComponent component={UpdateRelationshipAM} />,
  //     },
  //   ],
  // }

  return useRoutes([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <LoadComponent component={EmptyPage} isPublic />,
        },
        {
          path: '/permission-denied',
          element: <LoadComponent component={PermissionDenied} isPublic />,
        },
        organizationRoutes,
        warehouseRoutes,
        productRoutes,
        returnRefundRoutes,
        listingStatusRoutes,
        marketplaceRoutes,
        marketplaceRelationshipRoutes,
        assignedProductRoutes,
        orderRoutes,
        productPropertyRoutes,
        defaultPropertyValueRoutes,
        productCategoryMappingsRoutes,
        productPropertyMappingsRoute,
        courierMappingsRoutes,
        importProductPropertiesRoutes,
        deliveryTypeMappingsRoutes,
        // userRoutes,
        // aggregatorRoutes,
        // aggregatorMarketplaceRelationshipRoutes
      ],
    },
  ])
}

export {AllRoutes}
