"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("app/events"));
class IndexController {
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            events_1.default.emit("new:user", "Joe");
            return res.status(402).json({
                success: true,
                message: "Welcome to the best api starter"
            });
        });
    }
    static notFound(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(402).json({
                success: false,
                message: "Requested resource not found."
            });
        });
    }
}
exports.default = IndexController;
