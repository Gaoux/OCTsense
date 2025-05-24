// Polyfill para import.meta.env
import { TextEncoder, TextDecoder } from 'util';
import React from 'react';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.React = React;

// Mock para react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
  useLocation: () => ({ search: '?token=abc' })
}));

globalThis.import_meta_env = {
  env: {
    VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000/api'
  }
};

// Mock para APIs globales del navegador
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

global.FormData = class FormData {
  constructor() {
    this.append = jest.fn();
    this.get = jest.fn();
    this.getAll = jest.fn();
    this.has = jest.fn();
    this.set = jest.fn();
    this.delete = jest.fn();
    this.entries = jest.fn();
    this.keys = jest.fn();
    this.values = jest.fn();
    this.forEach = jest.fn();
  }
};