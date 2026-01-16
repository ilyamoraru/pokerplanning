export const useGameResults = (gamers: Gamer[]) => {
  const numericValues = gamers
    .filter((item) => item.card && item.card.type === CardType.numeric)
    .map((item) => item.card!.value)

  const calculateAverage = (values: number[]): number => {
    const value = values.reduce((a, b) => a + b, 0) / values.length
    if (!value) return 0

    return Number(value.toFixed(2))
  }
  const agreement = calculateAgreement(numericValues) * 100
  const average = calculateAverage(numericValues)
  const result = Math.ceil(average)

  // тут начинается неведомый мир нейросетей и лени в этом разибраться)
  /**
   * Комбинированный метод расчета согласия голосов пользователей
   * с учетом того, что значения основаны на числах Фибоначчи
   * @param votes Массив голосов пользователей (числа Фибоначчи или близкие к ним)
   * @returns Коэффициент согласия от 0 до 1, где 1 - полное согласие
   */
  function calculateAgreement(votes: number[]): number {
    // Проверка входных данных
    if (!votes || votes.length === 0) {
      return 0
    }

    if (votes.length === 1) {
      return 1 // Если всего один голос, согласие максимальное
    }

    // Проверяем, являются ли значения числами Фибоначчи или близкими к ним
    const isFibonacciBased = checkIfFibonacciBased(votes)

    // 1. Метрика на основе "близости" к стандартным значениям Фибоначчи
    const fibonacciAgreement = isFibonacciBased ? calculateFibonacciAlignment(votes) : 1 // Если не числа Фибоначчи, не применяем эту метрику

    // 2. Метрика на основе логарифмического диапазона (важно для Фибоначчи)
    const logVotes = votes.map((vote) => Math.log(vote + 1)) // +1 для избежания log(0)
    const logMin = Math.min(...logVotes)
    const logMax = Math.max(...logVotes)
    const logRange = logMax - logMin

    const logAgreement =
      logRange > 0
        ? 1 / (1 + logRange) // Чем меньше логарифмический разброс, тем больше согласие
        : 1

    // 3. Метрика на основе отношения максимального к минимальному (для Фибоначчи это важно)
    const minVote = Math.min(...votes)
    const maxVote = Math.max(...votes)
    const ratio = maxVote / minVote

    // Для чисел Фибоначчи большие отношения ожидаемы, поэтому нормализуем иначе
    const ratioAgreement = isFibonacciBased
      ? Math.exp(-Math.log(ratio) / Math.log(10)) // Мягкая нормализация для экспоненциального роста
      : 1 / (1 + Math.log(ratio)) // Стандартная логарифмическая нормализация

    // 4. Метрика на основе плотности (группировка по "близким" значениям Фибоначчи)
    const densityAgreement = calculateFibonacciDensity(votes, isFibonacciBased)

    // 5. Метрика на основе "ступенчатости" (дискретности значений)
    const stepnessAgreement = calculateStepnessAgreement(votes, isFibonacciBased)

    // Комбинируем метрики с учетом природы чисел Фибоначчи
    if (isFibonacciBased) {
      // Для чисел Фибоначчи больше веса даем логарифмическим и дискретным метрикам
      return (
        fibonacciAgreement * 0.2 +
        logAgreement * 0.25 +
        ratioAgreement * 0.15 +
        densityAgreement * 0.25 +
        stepnessAgreement * 0.15
      )
    } else {
      // Для обычных чисел используем стандартные веса
      return (
        logAgreement * 0.3 +
        ratioAgreement * 0.2 +
        densityAgreement * 0.35 +
        stepnessAgreement * 0.15
      )
    }
  }

  /**
   * Проверяет, основаны ли значения на числах Фибоначчи
   */
  function checkIfFibonacciBased(votes: number[]): boolean {
    // Стандартная последовательность Фибоначчи для сравнения
    const standardFibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]

    // Проверяем, попадают ли хотя бы 70% значений в стандартную последовательность
    const fibonacciCount = votes.filter(
      (vote) => standardFibonacci.includes(vote) || standardFibonacci.includes(Math.round(vote))
    ).length

    return fibonacciCount / votes.length >= 0.7
  }

  /**
   * Вычисляет, насколько голоса соответствуют числам Фибоначчи
   */
  function calculateFibonacciAlignment(votes: number[]): number {
    const standardFibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]

    // Находим ближайшие числа Фибоначчи для каждого голоса
    const alignments = votes.map((vote) => {
      let minDiff = Infinity

      for (const fib of standardFibonacci) {
        const diff = Math.abs(vote - fib) / fib // Относительная разница
        if (diff < minDiff) {
          minDiff = diff
        }
      }

      // Преобразуем разницу в меру соответствия (1 - полное соответствие)
      return Math.max(0, 1 - minDiff * 2) // Усиливаем чувствительность
    })

    return alignments.reduce((sum, align) => sum + align, 0) / alignments.length
  }

  /**
   * Вычисляет плотность голосов с учетом особенностей чисел Фибоначчи
   */
  function calculateFibonacciDensity(votes: number[], isFibonacciBased: boolean): number {
    // Для чисел Фибоначчи используем более широкую группировку
    const groupingPrecision = isFibonacciBased ? 0.5 : 0.2

    // Группируем округленные значения
    const roundedVotes = votes.map(
      (vote) => Math.round(vote / groupingPrecision) * groupingPrecision
    )

    // Находим наиболее частые группы
    const frequencyMap = new Map<number, number>()
    roundedVotes.forEach((vote) => {
      frequencyMap.set(vote, (frequencyMap.get(vote) || 0) + 1)
    })

    const frequencies = Array.from(frequencyMap.values())
    const maxFrequency = Math.max(...frequencies)

    // Для чисел Фибоначчи ожидаем меньшую плотность из-за дискретности
    const expectedDensity = isFibonacciBased ? 0.3 : 0.5
    const rawDensity = maxFrequency / votes.length

    // Нормализуем с учетом ожиданий
    return Math.min(1, rawDensity / expectedDensity)
  }

  /**
   * Вычисляет согласие на основе "ступенчатости" значений
   * (важно для дискретных систем типа Фибоначчи)
   */
  function calculateStepnessAgreement(votes: number[], isFibonacciBased: boolean): number {
    if (votes.length < 2) return 1

    const sortedVotes = [...votes].sort((a, b) => a - b)
    const uniqueValues = Array.from(new Set(sortedVotes))

    // Если все значения одинаковые - максимальное согласие
    if (uniqueValues.length === 1) return 1

    // Для чисел Фибоначчи считаем "естественность" шагов
    if (isFibonacciBased) {
      // Проверяем, образуют ли значения подпоследовательность Фибоначчи
      const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55]
      const isSubsequence = uniqueValues.every((value, index) => {
        if (index === 0) return true
        const prevIndex = fibonacciSequence.indexOf(uniqueValues[index - 1]!)
        const currIndex = fibonacciSequence.indexOf(value)
        return currIndex > 0 && prevIndex > 0 && currIndex === prevIndex + 1
      })

      if (isSubsequence) return 1
    }

    // Общая метрика: чем меньше уникальных значений, тем больше согласие
    const uniqueRatio = uniqueValues.length / votes.length

    // Нормализуем: если менее 30% значений уникальны - хорошее согласие
    return Math.max(0, 1 - uniqueRatio * 2)
  }

  return {
    agreement,
    average,
    result
  }
}
