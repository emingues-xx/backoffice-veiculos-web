import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange, DATE_PRESETS, validateDateRange, formatDateForDisplay } from '@/utils/dateValidation';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  onPresetChange?: (preset: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  showPresets?: boolean;
  presets?: Array<{ label: string; value: string; getDateRange: () => DateRange }>;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  onPresetChange,
  placeholder = 'Selecionar período',
  className = '',
  disabled = false,
  error,
  showPresets = true,
  presets = DATE_PRESETS
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [tempDateRange, setTempDateRange] = useState<DateRange>(value);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validar datas
  const validateDates = (startDate: Date | null, endDate: Date | null) => {
    const error = validateDateRange(startDate, endDate);
    setValidationError(error);
    return !error;
  };

  // Aplicar mudanças
  const applyChanges = () => {
    if (validateDates(tempDateRange.startDate, tempDateRange.endDate)) {
      onChange(tempDateRange);
      setIsOpen(false);
    }
  };

  // Cancelar mudanças
  const cancelChanges = () => {
    setTempDateRange(value);
    setValidationError(null);
    setIsOpen(false);
  };

  // Limpar seleção
  const clearSelection = () => {
    const emptyRange: DateRange = { startDate: null, endDate: null };
    setTempDateRange(emptyRange);
    onChange(emptyRange);
    setSelectedPreset('');
    if (onPresetChange) {
      onPresetChange('');
    }
  };

  // Aplicar preset
  const applyPreset = (presetValue: string) => {
    const preset = presets.find(p => p.value === presetValue);
    if (preset) {
      const dateRange = preset.getDateRange();
      setTempDateRange(dateRange);
      setSelectedPreset(presetValue);
      onChange(dateRange);
      if (onPresetChange) {
        onPresetChange(presetValue);
      }
      setIsOpen(false);
    }
  };

  // Formatar texto de exibição
  const getDisplayText = () => {
    if (!value.startDate && !value.endDate) {
      return placeholder;
    }
    
    if (value.startDate && value.endDate) {
      return `${formatDateForDisplay(value.startDate)} - ${formatDateForDisplay(value.endDate)}`;
    }
    
    if (value.startDate) {
      return `A partir de ${formatDateForDisplay(value.startDate)}`;
    }
    
    if (value.endDate) {
      return `Até ${formatDateForDisplay(value.endDate)}`;
    }
    
    return placeholder;
  };

  const hasValue = value.startDate || value.endDate;
  const hasError = error || validationError;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 border rounded-md text-left
          ${hasError 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}
          focus:outline-none focus:ring-1
        `}
      >
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className={`${hasValue ? 'text-gray-900' : 'text-gray-500'}`}>
            {getDisplayText()}
          </span>
        </div>
        
        <div className="flex items-center">
          {hasValue && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="mr-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              <X className="w-3 h-3 text-gray-400" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Error message */}
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          {error || validationError}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-4">
            {/* Presets */}
            {showPresets && presets.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Períodos rápidos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => applyPreset(preset.value)}
                      className={`
                        px-3 py-2 text-sm text-left rounded-md border transition-colors
                        ${selectedPreset === preset.value
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data inicial
                </label>
                <input
                  ref={startDateRef}
                  type="date"
                  value={tempDateRange.startDate ? format(tempDateRange.startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    const newRange = { ...tempDateRange, startDate: date };
                    setTempDateRange(newRange);
                    validateDates(date, tempDateRange.endDate);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data final
                </label>
                <input
                  ref={endDateRef}
                  type="date"
                  value={tempDateRange.endDate ? format(tempDateRange.endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    const newRange = { ...tempDateRange, endDate: date };
                    setTempDateRange(newRange);
                    validateDates(tempDateRange.startDate, date);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Validation error */}
            {validationError && (
              <p className="mt-2 text-sm text-red-600">
                {validationError}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={cancelChanges}
                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={applyChanges}
                disabled={!!validationError}
                className="px-3 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
