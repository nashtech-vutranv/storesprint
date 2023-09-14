import {IPagesInfoActionType, PagesInfoActionType} from '../actions'
import {
  storePagesInfoToLocal,
  getPagesInfoFromLocal,
} from '../../helpers/localstorage'
import {IPageStoreInformation} from '../../interface/pageInfo'

export const initPageStoreObject = {
  organization: {},
  site: {},
  siteLocale: {},
  warehouse: {
    searchData: {
      selectedOrganizations: [],
    },
  },
  product: {
    searchData: {
      selectedOrganizations: [],
      selectedSites: [],
      selectedLocales: [],
    },
  },
  aggregator: {},
  marketplace: {},
  aggregatorMarketplace: {},
  relationship: {
    selectedOrganizations: [],
    selectedSites: [],
    selectedLocales: [],
  },
  assignedProduct: {
    isAllProductsSelected: false,
    selectedProducts: [],
    searchData: {
      selectedOrganization: null,
      selectedSite: null,
      selectedLocale: null,
      selectedMarketplaces: [],
    },
  },
  order: {
    searchData: {
      selectedOrganizations: [],
      selectedSites: [],
      selectedLocales: [],
      selectedMarketplaces: [],
      selectedStatuses: [],
    },
  },
  listingStatus: {
    searchData: {
      selectedOrganization: null,
      selectedSite: null,
      selectedLocale: null,
      selectedMarketplaces: [],
      selectedStatuses: [],
    },
  },
  marketplaceRelationship: {
    searchData: {
      selectedOrganizations: [],
      selectedSites: [],
      selectedLocales: [],
    },
  },
  user: {
    searchData: {
      selectedOrganization: null,
      selectedSites: [],
    },
  },
  mappings: {
    searchData: {
      selectedMappingType: null,
      selectedMappingMarketplace: null,
    },
  },
  defaultPropertyValue: {
    searchData: {
      selectedOrganizations: [],
      selectedProperties: [],
      selectedLocales: [],
    },
  },
  productCategoryMappings: {
    searchData: {
      selectedMmsProductCategory: null,
      selectedMarketplaceType: null,
      selectedOrganization: null
    },
  },
  productPropertyMappings: {
    searchData: {
      selectedMarketplaceType: null,
      selectedMarketplaceProductCategory: null,
      selectedMarketplaceProductProperty: null,
      selectedMarketplaceCode: null,
      selectedMarketplaceTypeId: null,
    },
    selectedRowData: {
      selectedMarketplaceTypeName: null,
      selectedMarketplaceProductProperty: null,
      selectedMMSProductProperty: null,
    },
    enumValueMappingData: {
      selectedMarketplaceTypeId: null,
      selectedPropertyName: null,
      selectedPropertyId: null,
    },
  },
  courierMappings: {
    searchData: {
      selectedMarketplaceType: null,
    },
  },
  returnsrefunds: {
    searchData: {
      selectedOrganizations: [],
      selectedSites: [],
      selectedLocales: [],
      selectedMarketplaces: [],
      selectedReturnStatuses: [],
    },
  },
  deliveryTypeMappings: {
    searchData: {
      selectedMarketplaceType: null,
    }
  }
}

const pageStoreInitialState: IPageStoreInformation =
  getPagesInfoFromLocal(initPageStoreObject)

const pagesInfoReducer = (
  state: IPageStoreInformation,
  action: IPagesInfoActionType<any>
) => {
  switch (action.type) {
    case PagesInfoActionType.GET_WAREHOUSE_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        warehouse: {
          searchData: {
            selectedOrganizations: action.payload,
          },
        },
      })
      return {
        ...state,
        warehouse: {
          searchData: {
            selectedOrganizations: action.payload,
          },
        },
      }
    }

    case PagesInfoActionType.GET_PRODUCT_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        product: {
          searchData: action.payload,
        },
      })
      return {
        ...state,
        product: {
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_RELATIONSHIP_PAGE_INFORMATION: {
      storePagesInfoToLocal({
        ...state,
        relationship: {
          ...state.relationship,
          ...action.payload,
        },
      })
      return {
        ...state,
        relationship: {
          ...state.relationship,
          ...action.payload,
        },
      }
    }
    case PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ITEMS: {
      storePagesInfoToLocal({
        ...state,
        assignedProduct: {
          ...state.assignedProduct,
          selectedProducts: action.payload,
        },
      })
      return {
        ...state,
        assignedProduct: {
          ...state.assignedProduct,
          selectedProducts: action.payload,
        },
      }
    }
    case PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SELECTED_ALL_STATE: {
      storePagesInfoToLocal({
        ...state,
        assignedProduct: {
          ...state.assignedProduct,
          isAllProductsSelected: action.payload,
        },
      })
      return {
        ...state,
        assignedProduct: {
          ...state.assignedProduct,
          isAllProductsSelected: action.payload,
        },
      }
    }
    case PagesInfoActionType.GET_ASSIGNED_PRODUCT_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        assignedProduct: {
          ...state.assignedProduct,
          searchData: action.payload,
        },
      })
      return {
        ...state,
        assignedProduct: {
          ...state.assignedProduct,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_ORDER_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        order: {
          ...state.order,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        order: {
          ...state.order,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_LISTING_STATUS_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        listingStatus: {
          ...state.listingStatus,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        listingStatus: {
          ...state.listingStatus,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_MARKETPLACE_RELATIONSHIP_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        marketplaceRelationship: {
          ...state.marketplaceRelationship,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        marketplaceRelationship: {
          ...state.marketplaceRelationship,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_USER_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        user: {
          ...state.user,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        user: {
          ...state.user,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_MAPPINGS_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        mappings: {
          ...state.mappings,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        mappings: {
          ...state.mappings,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_DEFAULT_PROPERTY_VALUE_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        defaultPropertyValue: {
          ...state.defaultPropertyValue,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        defaultPropertyValue: {
          ...state.defaultPropertyValue,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_PRODUCT_CATEGORY_MAPPINGS_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        productCategoryMappings: {
          ...state.productCategoryMappings,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        productCategoryMappings: {
          ...state.productCategoryMappings,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_PRODUCT_PROPERTY_MAPPINGS_PUSH_DATA: {
      const {
        selectedMarketplaceProductProperty,
        selectedMarketplaceCode,
        selectedMarketplaceTypeId,
      } = action.payload
      storePagesInfoToLocal({
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          searchData: {
            ...state.productPropertyMappings.searchData,
            selectedMarketplaceProductProperty,
            selectedMarketplaceCode,
            selectedMarketplaceTypeId,
          },
        },
      })

      return {
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          searchData: {
            ...state.productPropertyMappings.searchData,
            selectedMarketplaceProductProperty,
            selectedMarketplaceCode,
            selectedMarketplaceTypeId,
          },
        },
      }
    }

    case PagesInfoActionType.GET_SELECTED_PRODUCT_PROPERTY_MAPPING: {
      const {
        selectedMarketplaceTypeName,
        selectedMarketplaceProductProperty:
          marketplaceProductPropertyInSelectedRow,
        selectedMMSProductProperty,
      } = action.payload
      storePagesInfoToLocal({
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          selectedRowData: {
            ...state.productPropertyMappings.selectedRowData,
            selectedMarketplaceTypeName,
            selectedMarketplaceProductProperty:
              marketplaceProductPropertyInSelectedRow,
            selectedMMSProductProperty,
          },
        },
      })

      return {
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          selectedRowData: {
            ...state.productPropertyMappings.selectedRowData,
            selectedMarketplaceTypeName,
            selectedMarketplaceProductProperty:
              marketplaceProductPropertyInSelectedRow,
            selectedMMSProductProperty,
          },
        },
      }
    }

    case PagesInfoActionType.GET_ENUM_VALUE_MAPPINGS_SELECTED_DATA: {
      const {
        selectedMarketplaceTypeId,
        selectedPropertyName,
        selectedPropertyId,
      } = action.payload
      storePagesInfoToLocal({
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          enumValueMappingData: {
            selectedMarketplaceTypeId,
            selectedPropertyName,
            selectedPropertyId,
          },
        },
      })

      return {
        ...state,
        productPropertyMappings: {
          ...state.productPropertyMappings,
          enumValueMappingData: {
            selectedMarketplaceTypeId,
            selectedPropertyName,
            selectedPropertyId,
          },
        },
      }
    }

    case PagesInfoActionType.GET_COURIER_MAPPINGS_PAGE_SEARCH_DATA: {
      const {selectedMarketplaceType} = action.payload
      storePagesInfoToLocal({
        ...state,
        courierMappings: {
          ...state.courierMappings,
          searchData: {
            selectedMarketplaceType,
          },
        },
      })

      return {
        ...state,
        courierMappings: {
          ...state.courierMappings,
          searchData: {
            selectedMarketplaceType,
          },
        },
      }
    }

    case PagesInfoActionType.GET_RETURNS_REFUNDS_PAGE_SEARCH_DATA: {
      storePagesInfoToLocal({
        ...state,
        returnsrefunds: {
          ...state.returnsrefunds,
          searchData: action.payload,
        },
      })

      return {
        ...state,
        returnsrefunds: {
          ...state.returnsrefunds,
          searchData: action.payload,
        },
      }
    }

    case PagesInfoActionType.GET_DELIVERY_TYPE_MAPPINGS_PAGE_SEARCH_DATA: {
      const {selectedMarketplaceType} = action.payload
      storePagesInfoToLocal({
        ...state,
        deliveryTypeMappings: {
          ...state.deliveryTypeMappings,
          searchData: {
            selectedMarketplaceType,
          },
        },
      })

      return {
        ...state,
        deliveryTypeMappings: {
          ...state.deliveryTypeMappings,
          searchData: {
            selectedMarketplaceType,
          },
        },
      }
    }

    default:
      return state
  }
}

export {pageStoreInitialState, pagesInfoReducer}
