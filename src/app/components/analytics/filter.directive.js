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
class AnalyticsFilterDirective {
  constructor() {

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/analytics/filter.html',
      controller: AnalyticsFilterController,
      controllerAs: 'analyticsFilterCtrl',
      bindToController: true
    };

    return directive;
  }
}

class AnalyticsFilterController {
  constructor($scope, $rootScope) {
    'ngInject';
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.fields = {};
    this.filters = [];
    let _that = this;

    this.$rootScope.$on('filterItemChange', function (event, filter) {
      if (filter.mode === 'add') {
        _that.addFieldFilter(filter);
      } else if (filter.mode === 'remove') {
        _that.removeFieldFilter(filter);
      }
    });
  }

  addFieldFilter(filter) {
    let field = this.fields[filter.field] || {filters: {}};
    field.filters[filter.key] = filter.name;

    let label = filter.field + " = '" + filter.name + "'";
    let query = '(' + _.map(_.keys(field.filters), (key) => filter.field + ":" + key).join(' OR ') + ')';

    this.filters.push({
      key: filter.field + '_' + filter.key,
      label: label
    });

    field.query = query;

    this.fields[filter.field] = field;
    this.createAndSendQuery();
  }

  removeFieldFilter(filter) {
    this.removeFilter(filter.field, filter.key);
  }

  deleteChips(event) {
    let parts = event.key.split('_');
    this.removeFilter(parts[0], parts[1]);
  }

  removeFilter(field, key) {
    _.remove(this.filters, (current) => {
      return current.key === field + '_' + key;
    });

    let fieldObject = this.fields[field] || {filters: {}};

    delete fieldObject.filters[key];

    if (Object.keys(fieldObject.filters).length === 0 || _.isEmpty(fieldObject.filters)) {
      delete fieldObject.filters;
    }

    if (! _.isEmpty(fieldObject.filters)) {
      fieldObject.query = '(' + _.map(_.keys(fieldObject.filters), (key) => field + ":" + key).join(' OR ') + ')';
      this.fields[field] = fieldObject;
    } else {
      delete this.fields[field];
    }

    this.createAndSendQuery();
  }

  createAndSendQuery() {
    // Create a query with all the current filters
    let query = _.values(_.mapValues(this.fields, function(value) { return value.query; })).join(' AND ');

    this.$scope.$broadcast('queryChange', {
      query: query
    });
  }
}

export default AnalyticsFilterDirective;
