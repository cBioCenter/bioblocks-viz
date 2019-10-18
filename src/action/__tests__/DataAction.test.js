"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_mock_store_1 = require("redux-mock-store");
var thunk = require("redux-thunk");
var typesafe_actions_1 = require("typesafe-actions");
var action_1 = require("~bioblocks-viz~/action");
var middleWares = [thunk.default];
var mockStore;
describe('DataAction', function () {
    describe('Fetch Actions', function () {
        it('Should create error actions.', function () {
            var expectedAction = {
                payload: Error('Party crashed'),
                type: 'BIOBLOCKS/EXAMPLE_FETCH_DATA_FAILURE',
            };
            expect(action_1.createDataActions('example').failure(Error('Party crashed'))).toEqual(expectedAction);
        });
        it('Should create request actions.', function () {
            var expectedAction = {
                type: 'BIOBLOCKS/EXAMPLE_FETCH_DATA_REQUEST',
            };
            expect(action_1.createDataActions('example').request()).toEqual(expectedAction);
        });
        it('Should create success actions.', function () {
            var expectedAction = {
                payload: 'party',
                type: 'BIOBLOCKS/EXAMPLE_FETCH_DATA_SUCCESS',
            };
            expect(action_1.createDataActions('example').success('party')).toEqual(expectedAction);
        });
        it('Should use a namespace if provided.', function () {
            var namespace = 'FRATELLIS';
            expect(action_1.createDataActions('music', namespace).failure(Error('Nina')).type).toEqual('FRATELLIS/MUSIC_FETCH_DATA_FAILURE');
            expect(action_1.createDataActions('music', namespace).request().type).toEqual('FRATELLIS/MUSIC_FETCH_DATA_REQUEST');
            expect(action_1.createDataActions('music', namespace).success('Vince').type).toEqual('FRATELLIS/MUSIC_FETCH_DATA_SUCCESS');
        });
    });
    describe('Fetch Callback', function () {
        beforeEach(function () {
            mockStore = redux_mock_store_1.default(middleWares);
        });
        it('Should dispatch the right actions for successfully fetching data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var store, expectedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store = mockStore({});
                        return [4 /*yield*/, action_1.fetchDataset('example', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, Promise.resolve('A Sentence of Sorts')];
                            }); }); })(store.dispatch)];
                    case 1:
                        _a.sent();
                        expectedActions = [
                            {
                                type: typesafe_actions_1.getType(action_1.createDataActions('example').request),
                            },
                            {
                                payload: 'A Sentence of Sorts',
                                type: typesafe_actions_1.getType(action_1.createDataActions('example').success),
                            },
                        ];
                        expect(store.getActions()).toEqual(expectedActions);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should dispatch the right actions for failing to fetch data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var store, expectedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        store = mockStore({ labels: [] });
                        return [4 /*yield*/, action_1.fetchDataset('example', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, Promise.reject('No!')];
                            }); }); })(store.dispatch)];
                    case 1:
                        _a.sent();
                        expectedActions = [
                            {
                                type: typesafe_actions_1.getType(action_1.createDataActions('example').request),
                            },
                            {
                                payload: 'No!',
                                type: typesafe_actions_1.getType(action_1.createDataActions('example').failure),
                            },
                        ];
                        expect(store.getActions()).toEqual(expectedActions);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=DataAction.test.js.map