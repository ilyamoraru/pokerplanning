import { noun } from 'plural-ru'

/**
 * Функция определяет правильную форму существительного в зависимости от переданного количества (value).
 * @param {number} value - количество
 * @param {string} form1 - существительное в единственном числе
 * @param {string} form2 - form1 в родительном падеже
 * @param {string} form3 - form1 во множественном числе и в родительном падеже
 * @param {boolean} onlyString - выбирает нужно ли показывать число
 * @returns {string} - строка, содержащая отформатированное value (пример: 1222 -> 1 222) и корректную
 * форму существительного или только корректную
 * форму существительного
 */
export const toPlural = (
  value: string | number,
  form1: string,
  form2: string,
  form3: string,
  onlyString?: boolean
): string => {
  if (value) {
    const number = typeof value === 'number' ? value : parseFloat(value)
    const numberAsString = new Intl.NumberFormat('ru-RU').format(number)
    const valueNoun = noun(number, form1, form2, form3)

    return onlyString ? valueNoun : [numberAsString, valueNoun].join(' ')
  }

  return [0, form3].join(' ')
}
