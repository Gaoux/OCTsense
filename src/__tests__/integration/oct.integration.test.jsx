import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { predictOCT } from '../../api/octService';
import { AuthProvider } from '../../context/AuthContext';
import Upload from '../../features/upload';
// import Analysis from '../../features/analysis';

// Mockear las dependencias
jest.mock('axios');
jest.mock('react-i18next');
jest.mock('../../api/apiClient');
jest.mock('../../api/octService');
jest.mock('../../api/reportService', () => ({
    createReport: jest.fn().mockResolvedValue({ data: { id: 'report-123' } })
}));
jest.mock('jspdf', () => {
    return jest.fn().mockImplementation(() => ({
        setFontSize: jest.fn(),
        setFont: jest.fn(),
        setTextColor: jest.fn(),
        text: jest.fn(),
        addImage: jest.fn(),
        save: jest.fn(),
    }));
});

global.URL.createObjectURL = jest.fn();

describe('Componente Upload', () => {
    beforeEach(() => {
        // Resetear mocks antes de cada test
        jest.clearAllMocks();
    });

    it('debe cargar una imagen correctamente', async () => {
        // Mockear usuario autenticado
        const user = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'professional'
        };

        // Mockear el componente Upload con AuthProvider
        render(
            <MemoryRouter>
                <AuthProvider user={user}>
                    <Upload />
                </AuthProvider>
            </MemoryRouter>
        );

        // Crear un mock de archivo
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

        // Simular selección de archivo
        const input = screen.getByTestId('file-input');
        await act(async () => {
            fireEvent.change(input, {
                target: { files: [file] }
            });
        });

        // Verificar que la imagen se cargó
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
        expect(screen.getByText('test.png')).toBeInTheDocument();
    });

    it('debe manejar el análisis de imagen exitosamente', async () => {
        // Mockear respuesta exitosa
        const mockPrediction = {
            prediction: 'CNV',
            probabilities: [0.85, 0.1, 0.03, 0.02]
        };

        // Mockear la función predictOCT
        predictOCT.mockResolvedValue(mockPrediction);

        // Mockear usuario autenticado
        const user = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'professional'
        };

        // Mockear el componente Upload con AuthProvider
        const { container } = render(
            <MemoryRouter>
                <AuthProvider user={user}>
                    <Upload />
                </AuthProvider>
            </MemoryRouter>
        );

        // Crear un mock de archivo
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

        // Simular selección de archivo
        const input = screen.getByTestId('file-input');
        await act(async () => {
            fireEvent.change(input, {
                target: { files: [file] }
            });
        });

        // Simular envío del formulario
        const submitButton = screen.getByTestId('submit-button');
        await act(async () => {
            fireEvent.click(submitButton);
        });

        // Verificar que se llamó al servicio de predicción
        await waitFor(() => {
            expect(predictOCT).toHaveBeenCalledWith(file);
        });
    });

    it('debe manejar errores durante el análisis de imagen', async () => {
        // Mockear error
        const errorMessage = 'Error al procesar la imagen';
        predictOCT.mockRejectedValue(new Error(errorMessage));

        // Mockear usuario autenticado
        const user = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'professional'
        };

        // Mockear el componente Upload con AuthProvider
        render(
            <MemoryRouter>
                <AuthProvider user={user}>
                    <Upload />
                </AuthProvider>
            </MemoryRouter>
        );

        // Crear un mock de archivo
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

        // Simular selección de archivo
        const input = screen.getByTestId('file-input');
        await act(async () => {
            fireEvent.change(input, {
                target: { files: [file] }
            });
        });

        // Simular envío del formulario
        const submitButton = screen.getByTestId('submit-button');
        await act(async () => {
            fireEvent.click(submitButton);
        });

        // Verificar que se muestra el mensaje de error
        await waitFor(() => {
            expect(screen.getByText(/Error al procesar la imagen|upload.error/i)).toBeInTheDocument();
        });
    });
});

describe('Componente Analysis', () => {
    let mockCreateReport;

    beforeEach(() => {
        // Resetear mocks antes de cada test
        jest.clearAllMocks();
        mockCreateReport = require('../../api/reportService').createReport;
    });

    it('debe mostrar los resultados del análisis correctamente', async () => {
        // Mockear datos de análisis
        const mockState = {
            imageFile: new File(['dummy content'], 'test.png', { type: 'image/png' }),
            predictionResult: {
                prediction: 'CNV',
                probabilities: [0.85, 0.1, 0.03, 0.02]
            }
        };

        // Mockear usuario profesional
        const user = {
            id: '1',
            email: 'doctor@example.com',
            name: 'Dr. Test',
            role: 'professional'
        };

        // Mockear useLocation
        jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
            state: mockState
        });

        // Importar el componente DESPUÉS de configurar los mocks
        const Analysis = require('../../features/analysis').default;

        // Renderizar el componente
        render(
            <MemoryRouter>
                <AuthProvider user={user}>
                    <Analysis />
                </AuthProvider>
            </MemoryRouter>
        );

        // Verificar que se muestran los resultados
        await waitFor(() => {
            expect(screen.getByText(/CNV|Coroidal Neovascularization|analysis.no_data_found/i)).toBeInTheDocument();
            expect(screen.getByText(/85%/i)).toBeInTheDocument();
            expect(screen.getByText(/10%/i)).toBeInTheDocument();
        });
    });

    it('debe permitir generar reportes para profesionales', async () => {
        // Mockear datos de análisis
        const mockState = {
            imageFile: new File(['dummy content'], 'test.png', { type: 'image/png' }),
            predictionResult: {
                prediction: 'DME',
                probabilities: [0.1, 0.8, 0.05, 0.05]
            }
        };

        // Mockear usuario profesional
        const user = {
            id: '1',
            email: 'doctor@example.com',
            name: 'Dr. Test',
            role: 'professional'
        };

        // Mockear useLocation
        jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
            state: mockState
        });

        // Mockear react-i18next
        jest.mock('react-i18next', () => ({
            useTranslation: () => ({
                t: (key) => key,
                i18n: { changeLanguage: jest.fn() }
            })
        }));

        // Importar el componente DESPUÉS de configurar los mocks
        const Analysis = require('../../features/analysis').default;

        // Renderizar el componente
        render(
            <MemoryRouter>
                <AuthProvider user={user}>
                    <Analysis />
                </AuthProvider>
            </MemoryRouter>
        );

        // Esperar a que el componente cargue los datos
        await waitFor(() => {
            expect(screen.getByTestId('comments-textarea')).toBeInTheDocument();
        });

        // Simular comentarios
        const textarea = screen.getByTestId('comments-textarea');
        fireEvent.change(textarea, { target: { value: 'Observaciones importantes' } });

        // Simular clic en guardar reporte
        const saveButton = screen.getByTestId('save-report-button');
        await act(async () => {
            fireEvent.click(saveButton);
        });

        // Verificar que se llamó al servicio
        await waitFor(() => {
            expect(mockCreateReport).toHaveBeenCalled();
            expect(mockCreateReport.mock.calls[0][0].append).toBeDefined();
        });
    }, 10000);
});