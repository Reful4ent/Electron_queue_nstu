import { FC } from "react";
import { Button, DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import locale from 'antd/locale/ru_RU';
import { CalendarOutlined, LoadingOutlined } from '@ant-design/icons';
import './DateRangePicker.scss';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  title?: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  onDateRangeChange: (dates: any) => void;
  onFinish: () => void;
  buttonText?: string;
  isLoading?: boolean;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({
  title = "Выберите период",
  dateRange,
  onDateRangeChange,
  onFinish,
  buttonText = "Получить расписание",
  isLoading = false
}) => {
  return (
    <div className="dateRangePickerForm">
      <div className="dateRangePickerFormInner">
        <p className="dateRangePickerFormHead">
          {title}
        </p>
        <ConfigProvider locale={locale} theme={{
          token: {
            colorPrimary: '#00B265',
            colorSuccess: '#00B265',
            fontSizeLG: 16,
            borderRadiusSM: 8,
          },
          components: {
            DatePicker: {
              activeBorderColor: '#00B265',
              hoverBorderColor: '#00B265',
              cellActiveWithRangeBg: '#e6f7ff'
            }
          }
        }}>
          <div className="date-picker-wrapper">
            <RangePicker
              className="date-range-picker"
              value={dateRange}
              onChange={onDateRangeChange}
              format="DD.MM.YYYY"
              allowClear={false}
              placeholder={['', '']}
              inputReadOnly
              disabled={isLoading}
            />
            <div className="date-fields-container">
              <div className="date-field">
                <CalendarOutlined className="calendar-icon" />
                <div className="date-text">
                  {dateRange[0]?.format('DD.MM.YYYY')}
                </div>
              </div>
              <div className="arrow-separator">
                →
              </div>
              <div className="date-field">
                <CalendarOutlined className="calendar-icon" />
                <div className="date-text">
                  {dateRange[1]?.format('DD.MM.YYYY')}
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
        <Button 
          onClick={onFinish} 
          className="get-schedule-button"
          disabled={isLoading}
          icon={isLoading ? <LoadingOutlined /> : null}
        >
          {isLoading ? "Загрузка..." : buttonText}
        </Button>
      </div>
    </div>
  );
}; 