/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import angular = require('angular');
import ApiService from "../../services/api.service";

export class HomeController {
  private apis: any[];
  private homepage: any;
  private ratingEnabled: boolean;

  constructor ( private resolvedApis,
                private $state,
                private resolvedHomepage,
                private Constants,
                private ApiService: ApiService) {
    'ngInject';
    this.apis = resolvedApis;
    this.homepage = resolvedHomepage;
    this.$state = $state;
    this.ratingEnabled = ApiService.isRatingEnabled();
  }

  querySearch(query) {
    var results = query ? this.apis.filter( this.createFilterFor(query) ) : this.apis;
    return results;
  }

  createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(item) {
      return (item.value.indexOf(lowercaseQuery) === 0);
    };
  }

  selectedItemChange(api) {
    if (api) {
      this.$state.go('portal.api.detail', {'apiId': api.id});
    }
  }

  getLogo() {
    return this.Constants.theme.logo;
  }

  goToApi(api) {
    this.$state.go('portal.api.detail', {apiId: api.id});
  }

  goToView(event, view) {
    event.stopPropagation();
    this.$state.go('portal.apilist', {view: view});
  }

  goToRating(event, api) {
    event.stopPropagation();
    this.$state.go('portal.api.rating', {apiId: api.id});
  }
}
