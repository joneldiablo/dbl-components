import t, { formatDate, formatNumber, formatCurrency, formatTime, getLang } from "./i18n";

export default (value, conf) => {
  if (!conf?.format) return value;
  switch (conf.format) {
    case 'number':
      return typeof value === 'boolean' ? Number(value)
        : value.toLocaleString(getLang(), formatNumber(conf.context));
    case 'currency':
      const globalConf = formatCurrency(conf.context);
      return value.toLocaleString(getLang(), {
        ...globalConf,
        currency: conf.currency || globalConf.currency,
      });
    case 'dictionary':
      return t(value, conf.context);
    case 'date':
      return moment(value).format(formatDate(conf.context));
    case 'time':
      return moment(value).format(formatTime(conf.context));
    default:
      return value;
  }
}