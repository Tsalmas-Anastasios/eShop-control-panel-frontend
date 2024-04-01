import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, NoPreloading } from '@angular/router';
import { AuthGuard } from './services/guards/auth.service';

import { DashboardComponent } from './pages/layout/dashboard/dashboard.component';
import { DashboardViewModule } from './pages/dashboard-view/dashboard-view.module';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutModule } from './pages/auth/logout/logout.module';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { PageNotFoundComponent } from './pages/error-pages/page-not-found/page-not-found.component';
// import { ConnectionLostComponent } from './pages/error-pages/connection-lost/connection-lost.component';
// import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { PrintComponent } from './pages/layout/print/print.component';
// import { OrderPapersModule } from './pages/printable-documents/order-papers/order-papers.module';
import { OrderPapersComponent } from './pages/printable-documents/order-papers/order-papers.component';
import { SettingsComponent } from './pages/layout/settings/settings.component';
import { TfaGuard } from './services/guards/settings/tfa.service';
import { DeAuthGuard } from './services/guards/de-auth.service';
import { ListComponent } from './pages/settings/connected-users/list/list.component';
import { ConnectedUsersGuard } from './services/guards/settings/connected-users.service';
import { ConnectedUsersDetailsGuard } from './services/guards/settings/connected-users-details.service';
import { ConnectedUsersListGuard } from './services/guards/settings/connected-users-list.service';
import { CashRegistryDetailsGuard } from './services/guards/cash-registry.service';
import { OrdersGuard } from './services/guards/orders.service';
import { ProductsGuard } from './services/guards/products.service';
import { GlobalSearchOrdersGuard } from './services/guards/global-search-orders.service';
import { GlobalSearchProductsGuard } from './services/guards/global-search-products.service';
import { ProductCategoriesGuard } from './services/guards/product-categories.service';
import { CompanyDataGuard } from './services/guards/settings/company-data.service';
import { IntegrationsCompanyEmailsGuard } from './services/guards/settings/integrations/company-emails.service';
import { WarehousesGuard } from './services/guards/settings/warehouses.service';
import { WarehousesListGuard } from './services/guards/settings/warehouses-list.service';
import { WarehousesDetailsGuard } from './services/guards/settings/warehouses-details.service';



const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => DashboardViewModule
            },
            {
                path: 'cash-register',
                canActivate: [CashRegistryDetailsGuard],
                loadChildren: () => import('./pages/cash-register/cash-register.module').then(m => m.CashRegisterModule),
            },
            {
                path: 'orders',
                canActivate: [OrdersGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/orders/orders-list/orders-list.module').then(m => m.OrdersListModule)
                    },
                    {
                        path: ':order_id',
                        loadChildren: () => import('./pages/orders/order/order.module').then(m => m.OrderModule),
                    }
                ]
            },
            {
                path: 'products',
                canActivate: [ProductsGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/products/products-list/products-list.module').then(m => m.ProductsListModule),
                    },
                    {
                        path: ':product_id',
                        loadChildren: () => import('./pages/products/product/product.module').then(m => m.ProductModule),
                    },
                ]
            },
            {
                path: 'product-categories',
                canActivate: [ProductCategoriesGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/products/categories/list/list.module').then(m => m.ListModule),
                    },
                    {
                        path: '',
                        loadChildren: () => import('./pages/products/categories/new-category/new-category.module').then(m => m.NewCategoryModule),
                    }
                ]
            },
            {
                path: 'search',
                children: [
                    {
                        path: 'orders',
                        canActivate: [GlobalSearchOrdersGuard],
                        loadChildren: () => import('./pages/global-search/orders-search/orders-search.module').then(m => m.OrdersSearchModule),
                    },
                    {
                        path: 'products',
                        canActivate: [GlobalSearchProductsGuard],
                        loadChildren: () => import('./pages/global-search/products-search/products-search.module').then(m => m.ProductsSearchModule),
                    }
                ]
            },

            // product inventories routes
            {
                path: 'product-inventories',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/products-inventory/list/list.module').then(m => m.ListModule),
                    },
                    {
                        path: 'settings',
                        loadChildren: () => import('./pages/products-inventory/settings/settings.module').then(m => m.SettingsModule)
                    }
                ]
            },


            {
                path: 'contacts',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/contacts/contacts-list.module').then(m => m.ContactsListModule)
                    },
                    {
                        path: ':contact_id',
                        loadChildren: () => import('./pages/contacts/contact/contact.module').then(m => m.ContactModule),
                    }
                ]
            }
        ]
    },

    // settings dashboard
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./pages/settings/profile/profile.module').then(m => m.ProfileModule),
            },
            {
                path: 'company',
                canActivate: [CompanyDataGuard],
                loadChildren: () => import('./pages/settings/company-data/company-data.module').then(m => m.CompanyDataModule),
            },
            {
                path: 'warehouses',
                children: [
                    {
                        path: '',
                        canActivate: [WarehousesGuard, WarehousesListGuard],
                        loadChildren: () => import('./pages/settings/warehouses/list/list.module').then(m => m.WarehousesSettingsListModule),
                    },
                    {
                        path: ':warehouse_id',
                        canActivate: [WarehousesGuard, WarehousesDetailsGuard],
                        loadChildren: () => import('./pages/settings/warehouses/warehouse-page/warehouse-page.module').then(m => m.WarehousePageModule),
                    }
                ]
            },
            {
                path: 'connected-users',
                canActivate: [ConnectedUsersGuard],
                children: [
                    {
                        path: '',
                        canActivate: [ConnectedUsersGuard, ConnectedUsersListGuard],
                        loadChildren: () => import('./pages/settings/connected-users/list/list.module').then(m => m.ListModule),
                    },
                    {
                        path: ':user_id',
                        canActivate: [ConnectedUsersGuard, ConnectedUsersDetailsGuard],
                        loadChildren: () => import('./pages/settings/connected-users/user-details/user-details.module').then(m => m.UserDetailsModule),
                    }
                ]
            },
            {
                path: 'integrations',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/settings/integrations/integrations-home/integrations-home.module').then(m => m.IntegrationsHomeModule),
                    },
                    {
                        path: 'company-emails',
                        canActivate: [IntegrationsCompanyEmailsGuard],
                        loadChildren: () => import('./pages/settings/integrations/company-email/company-email.module').then(m => m.CompanyEmailModule),
                    }
                ]
            }
        ]
    },



    // auth routes
    {
        path: 'login',
        children: [
            {
                path: '',
                component: LoginComponent
            },
            {
                path: 'tfa',
                canActivate: [TfaGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/auth/tfa/middleware-options/middleware-options.module').then(m => m.MiddlewareOptionsModule),
                    },
                    {
                        path: 'authenticator-app',
                        loadChildren: () => import('./pages/auth/tfa/authenticator-app/authenticator-app.module').then(m => m.AuthenticatorAppModule),
                    },
                    {
                        path: 'email-authentication',
                        loadChildren: () => import('./pages/auth/tfa/email-authentication/email-authentication.module').then(m => m.EmailAuthenticationModule),
                    }
                ]
            }
        ]

    },

    // password change
    {
        path: 'password-change',
        canActivate: [DeAuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./pages/auth/password-change/password-change-credentials/password-change-credentials.module').then(m => m.PasswordChangeCredentialsModule),
            },
            {
                path: ':token',
                loadChildren: () => import('./pages/auth/password-change/change-password-form/change-password-form.module').then(m => m.ChangePasswordFormModule),
            }
        ]
    },
    {
        path: 'logout',
        component: LogoutComponent
    },

    // registration
    {
        path: 'register',
        canActivate: [DeAuthGuard],
        children: [
            {
                path: 'cu',              // connected-users
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/auth/registration/connected-users/connected-users.module').then(m => m.ConnectedUsersModule),
                    }
                ]
            }
        ]
    },


    // error pages
    // {
    //     path: 'connection-lost',
    //     component: ConnectionLostComponent
    // },
    {
        path: '**',
        component: PageNotFoundComponent
    },




    // print routes
    {
        path: 'print',
        outlet: 'print',
        component: PrintComponent,
        children: [
            {
                path: 'order-papers/:order_orderPapers',
                // loadChildren: () => OrderPapersModule,
                component: OrderPapersComponent
            }
        ]
    },
];






@NgModule({
    // useHash: true,
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: NoPreloading, // PreloadAllModules,
            // enableTracing: true,
            // useHash: true,
            onSameUrlNavigation: 'reload',
            relativeLinkResolution: 'legacy',
            anchorScrolling: 'enabled',
            scrollOffset: [0, 64] // [x, y] - adjust scroll offset
        }),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
