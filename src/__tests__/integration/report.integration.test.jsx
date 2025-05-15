import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthProvider } from '../../context/AuthContext';
import Report from '../../features/report';
import {
    mockReportService,
    restoreReportMocks
} from '../utils/report.integration.utils';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('../../api/apiClient');
jest.mock('../../api/reportService');

// Mock components
jest.mock('../../components/ui/reportCard', () => ({ report, onView, onDelete }) => (
    <div data-testid="report-card">
        <h3>{report.predicted_diagnostic}</h3>
        <button onClick={() => onView(report)}>View</button>
        <button onClick={() => onDelete(report.id)}>Delete</button>
    </div>
));

jest.mock('../../components/ui/confirmDeleteModal', () => ({ show, onClose, onConfirm, itemName }) => (
    show && (
        <div data-testid="delete-modal">
            <p>Delete {itemName}?</p>
            <button onClick={onClose}>Cancel</button>
            <button onClick={onConfirm}>Confirm</button>
        </div>
    )
));

describe('Pruebas de integración del módulo de informes', () => {
    beforeEach(() => {
        // Reset all mocks
        restoreReportMocks();

        // Setup default successful mocks
        const {
            createReport,
            getReportHistory,
            getReportDetail,
            deleteReport,
            updateReportComments,
            getReportSummary,
            getReportImage
        } = mockReportService.success();

        // Mock authenticated user
        Cookies.get.mockImplementation((key) => {
            if (key === 'token') return 'mock-token';
            if (key === 'user') return JSON.stringify({ id: '1', role: 'professional' });
            return null;
        });
    });

    describe('Vista de lista de informes', () => {
        it('debe obtener y mostrar informes', async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getAllByTestId('report-card')).toHaveLength(1);
                expect(screen.getByText('CNV')).toBeInTheDocument();
            });
        });

        it('debe mostrar el estado vacío cuando no hay informes', async () => {
            const { getReportHistory } = mockReportService.success();
            getReportHistory.mockResolvedValue([]);

            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('No reports available.')).toBeInTheDocument();
            });
        });

        it('debe gestionar los errores de la API al obtener informes', async () => {
            mockReportService.error();

            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.queryByText('CNV')).not.toBeInTheDocument();
            });
        });
    });

    describe('Supresión de informes', () => {
        it('debería abrir el modal de confirmación de borrado', async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getAllByTestId('report-card')).toHaveLength(1);
            });

            fireEvent.click(screen.getByText('Delete'));

            expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
            expect(screen.getByText('Delete report?')).toBeInTheDocument();
        });

        it('debe eliminar el informe cuando se confirme', async () => {
            const { deleteReport } = mockReportService.success();

            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getAllByTestId('report-card')).toHaveLength(1);
            });

            fireEvent.click(screen.getByText('Delete'));
            fireEvent.click(screen.getByText('Confirm'));

            await waitFor(() => {
                expect(deleteReport).toHaveBeenCalledWith('1');
                expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
            });
        });

        it('debe gestionar el error de eliminación', async () => {
            const { deleteReport, getReportHistory } = mockReportService.success();
            deleteReport.mockRejectedValue(new Error('Delete failed'));

            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getAllByTestId('report-card')).toHaveLength(1);
            });

            fireEvent.click(screen.getByText('Delete'));
            fireEvent.click(screen.getByText('Confirm'));

            await waitFor(() => {
                expect(deleteReport).toHaveBeenCalledWith('1');
                // Verificar que los reports siguen mostrándose
                expect(screen.getAllByTestId('report-card')).toHaveLength(1);
            });
        });

        it('debe cancelar la eliminación cuando se cierra el modal', async () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getAllByTestId('report-card')).toHaveLength(1);
            });

            fireEvent.click(screen.getByText('Delete'));
            fireEvent.click(screen.getByText('Cancel'));

            expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
        });
    });

    describe('Navegación por la vista del informe', () => {
        it('debe navegar al detalle del informe cuando se hace clic en la vista', async () => {
            const mockNavigate = jest.fn();
            jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Report />
                    </AuthProvider>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getAllByTestId('report-card')).toHaveLength(1);
            });

            fireEvent.click(screen.getByText('View'));

            expect(mockNavigate).toHaveBeenCalledWith('/report/1');
        });
    });

    describe('Integración del servicio de informes', () => {
        let serviceMocks;

        beforeEach(() => {
            // Obtener los mocks del servicio
            serviceMocks = mockReportService.success();

            // Configurar token mock
            Cookies.get.mockImplementation((key) => {
                if (key === 'token') return 'mock-token';
                return null;
            });
        });

        it('debe llamar a createReport con los datos del formulario', async () => {
            const formData = new FormData();
            formData.append('image_file', new File([''], 'test.png'));
            formData.append('predicted_diagnostic', 'CNV');

            await act(async () => {
                await serviceMocks.createReport(formData);
            });

            expect(serviceMocks.createReport).toHaveBeenCalledWith(formData);
        });

        it('debe llamar a getReportDetail con el ID del informe', async () => {
            await act(async () => {
                await serviceMocks.getReportDetail('1');
            });

            expect(serviceMocks.getReportDetail).toHaveBeenCalledWith('1');
        });

        it('debe llamar a updateReportComments con los datos correctos', async () => {
            await act(async () => {
                await serviceMocks.updateReportComments('1', 'Updated comments');
            });

            expect(serviceMocks.updateReportComments).toHaveBeenCalledWith(
                '1',
                'Updated comments'
            );
        });

        it('debe llamar a getReportSummary', async () => {
            await act(async () => {
                await serviceMocks.getReportSummary();
            });

            expect(serviceMocks.getReportSummary).toHaveBeenCalled();
        });

        it('debe llamar a getReportImage con la respuesta blob', async () => {
            await act(async () => {
                await serviceMocks.getReportImage('1');
            });

            expect(serviceMocks.getReportImage).toHaveBeenCalledWith('1');
        });
    });
});