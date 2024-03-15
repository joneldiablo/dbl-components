import moment from "moment";
import t, { formatDate, formatNumber, formatCurrency, formatTime, formatDateTime, getLang } from "./i18n";

export default (value, conf) => {
  if (!conf?.format) return value;
  switch (conf.format) {
    case 'number':
      return typeof value === 'boolean' ? Number(value)
        : value.toLocaleString(getLang(), conf.formatConf || formatNumber(conf.context));
    case 'currency':
      const globalConf = conf.formatConf || formatCurrency(conf.context);
      return value.toLocaleString(getLang(), {
        ...globalConf,
        currency: conf.currency || globalConf.currency,
      });
    case 'dictionary':
      return t(value, conf.context);
    case 'date':
      return moment(value).format(conf.formatConf || formatDate(conf.context));
    case 'time':
      return moment(value).format(conf.formatConf || formatTime(conf.context));
    case 'date-time':
    case 'datetime':
      return moment(value).format(conf.formatConf || formatDateTime(conf.context));
    default:
      return value;
  }
}