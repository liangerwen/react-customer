"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.withCustom = exports.CustomProvider = void 0;
var custom_provider_1 = require("./custom-provider");
__createBinding(exports, custom_provider_1, "default", "CustomProvider");
var with_custom_1 = require("./with-custom");
__createBinding(exports, with_custom_1, "default", "withCustom");
