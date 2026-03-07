export const recipes = [
  {
    name: 'ПЭ-1: Грунтовка защитная',
    batch: 'B600001',
    batchSize: 1200,
    expiresAt: new Date('2026-10-31'),
    components: [
      { name: 'WORLEE Setal 6206', weight: 600.0 },
      { name: 'Dow AMP-95', weight: 18.0 },
      { name: 'Bayferrox 130M', weight: 144.0 },
      { name: 'Heucophos ZPO', weight: 48.0 },
      { name: 'Dow Butyl CARBITOL', weight: 36.0 },
      { name: 'BYK-024', weight: 3.6 },
      { name: 'Borchigel L 75 N', weight: 8.4 },
      { name: 'Вода', weight: 342.0 },
    ],
  },
  {
    name: 'ПЭ-2: Лак пропиточный',
    batch: 'B600002',
    batchSize: 800,
    expiresAt: new Date('2026-10-31'),
    components: [
      { name: 'WORLEE Setal 6206', weight: 480.0 },
      { name: 'Dow AMP-95', weight: 14.4 },
      { name: 'Dow Butyl CELLOSOLVE', weight: 32.0 },
      { name: 'Tego Foamex 810', weight: 1.6 },
      { name: 'Byk-348', weight: 4.0 },
      { name: 'Rheolate 288', weight: 4.0 },
      { name: 'Вода', weight: 264.0 },
    ],
  },
  {
    name: 'ПЭ-3: Эмаль высокоглянцевая',
    batch: 'B600003',
    batchSize: 1000,
    expiresAt: new Date('2026-02-31'),
    components: [
      { name: 'WORLEE Setal 1607', weight: 552.5 },
      { name: 'Kronos 2360', weight: 187.0 },
      { name: 'Dow Butyl CARBITOL', weight: 17.0 },
      { name: 'BYK-024', weight: 4.25 },
      { name: 'Tego Dispers 715W', weight: 4.25 },
      { name: 'Bayhydur 3100', weight: 150.0 },
      { name: 'Вода', weight: 85.0 },
    ],
  },
  {
    name: 'АК-1: Краска интерьерная матовая',
    batch: 'B600004',
    batchSize: 2500,
    expiresAt: new Date('2026-11-31'),
    components: [
      { name: 'Mowilith LDM 7418', weight: 625.0 },
      { name: 'Kronos 2300', weight: 125.0 },
      { name: 'Omyacarb 5-KU', weight: 750.0 },
      { name: 'Tego Dispers 750W', weight: 12.5 },
      { name: 'Eastman Texanol', weight: 20.0 },
      { name: 'Tylose H 10000', weight: 10.0 },
      { name: 'Tego Foamex 805', weight: 5.0 },
      { name: 'Mergal K10N', weight: 2.5 },
      { name: 'Вода', weight: 950.0 },
    ],
  },
  {
    name: 'АК-2: Краска полуглянцевая моющаяся',
    batch: 'B600005',
    batchSize: 1800,
    expiresAt: new Date('2026-08-31'),
    components: [
      { name: 'Acronal 7070', weight: 720.0 },
      { name: 'Kronos 2310', weight: 324.0 },
      { name: 'Finntalc M15', weight: 180.0 },
      { name: 'Tego Dispers 755W', weight: 10.8 },
      { name: 'Eastman Texanol', weight: 27.0 },
      { name: 'Acrysol RM-8W', weight: 14.4 },
      { name: 'BYK-028', weight: 5.4 },
      { name: 'Acticide MV', weight: 1.8 },
      { name: 'Вода', weight: 516.6 },
    ],
  },
  {
    name: 'АК-3: Краска фасадная',
    batch: 'B600006',
    batchSize: 3000,
    expiresAt: new Date('2026-01-31'),
    components: [
      { name: 'Acronal Plus 4830', weight: 1260.0 },
      { name: 'Kronos 2190', weight: 600.0 },
      { name: 'Microtalc IT Extra', weight: 360.0 },
      { name: 'Tego Dispers 760W', weight: 15.0 },
      { name: 'Eastman Texanol', weight: 60.0 },
      { name: 'Dow PnB', weight: 60.0 },
      { name: 'Rheolate 644', weight: 21.0 },
      { name: 'Tego Foamex 810', weight: 9.0 },
      { name: 'Acticide HF', weight: 15.0 },
      { name: 'Вода', weight: 600.0 },
    ],
  },
  {
    name: 'ВД-1: Краска глубокоматовая для потолков',
    batch: 'B600007',
    batchSize: 2000,
    expiresAt: new Date('2026-10-01'),
    components: [
      { name: 'Acronal 290D', weight: 400.0 },
      { name: 'Kronos 2300', weight: 80.0 },
      { name: 'Omyacarb 2-KU', weight: 820.0 },
      { name: 'Tego Dispers 750W', weight: 8.0 },
      { name: 'Eastman Texanol', weight: 12.0 },
      { name: 'Tylose H 6000', weight: 6.0 },
      { name: 'Tego Foamex 805', weight: 4.0 },
      { name: 'Acticide MV', weight: 2.0 },
      { name: 'Вода', weight: 668.0 },
    ],
  },
  {
    name: 'ВД-2: Краска силиконовая фасадная',
    batch: 'B600008',
    batchSize: 1600,
    expiresAt: new Date('2026-10-24'),
    components: [
      { name: 'SILRES BS 45', weight: 560.0 },
      { name: 'Kronos 2190', weight: 320.0 },
      { name: 'Microtalc IT Extra', weight: 240.0 },
      { name: 'Tego Dispers 760W', weight: 9.6 },
      { name: 'Eastman Texanol', weight: 22.4 },
      { name: 'Rheolate 644', weight: 12.8 },
      { name: 'Tego Foamex 810', weight: 4.8 },
      { name: 'Acticide HF', weight: 8.0 },
      { name: 'Вода', weight: 422.4 },
    ],
  },
  {
    name: 'ВД-3: Краска универсальная',
    batch: 'B600009',
    batchSize: 2200,
    expiresAt: new Date('2026-07-31'),
    components: [
      { name: 'Mowilith LDM 7418', weight: 660.0 },
      { name: 'Kronos 2300', weight: 176.0 },
      { name: 'Omyacarb 5-KU', weight: 550.0 },
      { name: 'Finntalc M15', weight: 154.0 },
      { name: 'Tego Dispers 750W', weight: 11.0 },
      { name: 'Eastman Texanol', weight: 26.4 },
      { name: 'Acrysol RM-8W', weight: 15.4 },
      { name: 'BYK-028', weight: 6.6 },
      { name: 'Acticide MV', weight: 2.2 },
      { name: 'Вода', weight: 598.4 },
    ],
  },
  {
    name: 'ВД-4: Краска эластичная',
    batch: 'B600010',
    batchSize: 1800,
    expiresAt: new Date('2026-12-31'),
    components: [
      { name: 'Acronal Plus 4830', weight: 810.0 },
      { name: 'Kronos 2190', weight: 270.0 },
      { name: 'Microtalc IT Extra', weight: 180.0 },
      { name: 'Tego Dispers 760W', weight: 9.0 },
      { name: 'Eastman Texanol', weight: 36.0 },
      { name: 'Dow PnB', weight: 36.0 },
      { name: 'Rheolate 644', weight: 14.4 },
      { name: 'Tego Foamex 810', weight: 5.4 },
      { name: 'Acticide HF', weight: 9.0 },
      { name: 'Вода', weight: 430.2 },
    ],
  },
  {
    name: 'ВД-5: Краска противоконденсатная',
    batch: 'B600011',
    batchSize: 1400,
    expiresAt: new Date('2026-12-31'),
    components: [
      { name: 'Acronal S 790', weight: 490.0 },
      { name: 'Kronos 2300', weight: 112.0 },
      { name: 'Omyacarb 5-KU', weight: 336.0 },
      { name: 'Perlite', weight: 140.0 },
      { name: 'Tego Dispers 750W', weight: 7.0 },
      { name: 'Eastman Texanol', weight: 14.0 },
      { name: 'Tylose H 10000', weight: 5.6 },
      { name: 'Tego Foamex 805', weight: 4.2 },
      { name: 'Acticide MV', weight: 1.4 },
      { name: 'Вода', weight: 289.8 },
    ],
  },
];
interface Recipes {
  name: string;
  batch: string;
  batchSize: number;
  components: { name: string; weight: number };
}
[];

export const componentsCatalog = [
  // Полиэфиры
  { name: 'WORLEE Setal 6206', batches: ['S300001', 'S300002'] }, // 2 партии
  { name: 'WORLEE Setal 1607', batches: ['S300003'] }, // 1 партия

  // Акриловые дисперсии
  { name: 'Mowilith LDM 7418', batches: ['S300004', 'S300009'] }, // 2 партии
  { name: 'Acronal 7070', batches: ['S300005'] }, // 1 партия
  { name: 'Acronal Plus 4830', batches: ['S300006', 'S300010'] }, // 2 партии
  { name: 'Acronal 290D', batches: ['S300007'] }, // 1 партия
  { name: 'Acronal S 790', batches: ['S300011'] }, // 1 партия

  // Силиконовые
  { name: 'SILRES BS 45', batches: ['S300008'] }, // 1 партия

  // Пигменты (диоксид титана)
  { name: 'Kronos 2360', batches: ['S300012'] }, // 1 партия
  {
    name: 'Kronos 2300',
    batches: ['S300013', 'S300014', 'S300015', 'S300016'],
  }, // 4 партии
  { name: 'Kronos 2310', batches: ['S300017'] }, // 1 партия
  { name: 'Kronos 2190', batches: ['S300018', 'S300019', 'S300020'] }, // 3 партии

  // Наполнители
  { name: 'Bayferrox 130M', batches: ['S300021'] }, // 1 партия
  { name: 'Heucophos ZPO', batches: ['S300022'] }, // 1 партия
  { name: 'Omyacarb 5-KU', batches: ['S300023', 'S300024', 'S300025'] }, // 3 партии
  { name: 'Omyacarb 2-KU', batches: ['S300026'] }, // 1 партия
  { name: 'Finntalc M15', batches: ['S300027', 'S300028'] }, // 2 партии
  { name: 'Microtalc IT Extra', batches: ['S300029', 'S300030', 'S300031'] }, // 3 партии
  { name: 'Perlite', batches: ['S300032'] }, // 1 партия

  // Коалесценты и растворители
  { name: 'Dow Butyl CARBITOL', batches: ['S300033', 'S300034'] }, // 2 партии
  { name: 'Dow Butyl CELLOSOLVE', batches: ['S300035'] }, // 1 партия
  {
    name: 'Eastman Texanol',
    batches: ['S300036', 'S300037', 'S300038', 'S300039'],
  }, // 4 партии
  { name: 'Dow PnB', batches: ['S300044', 'S300045'] }, // 2 партии

  // Добавки (нейтрализаторы, диспергаторы, ПАВ)
  { name: 'Dow AMP-95', batches: ['S300046', 'S300047'] }, // 2 партии
  { name: 'Tego Dispers 715W', batches: ['S300048'] }, // 1 партия
  {
    name: 'Tego Dispers 750W',
    batches: ['S300049', 'S300050', 'S300051', 'S300052'],
  }, // 4 партии
  { name: 'Tego Dispers 755W', batches: ['S300053'] }, // 1 партия
  { name: 'Tego Dispers 760W', batches: ['S300054', 'S300055', 'S300056'] }, // 3 партии
  { name: 'Byk-348', batches: ['S300057'] }, // 1 партия

  // Пеногасители
  { name: 'BYK-024', batches: ['S300058', 'S300059'] }, // 2 партии
  { name: 'BYK-028', batches: ['S300060', 'S300061'] }, // 2 партии
  { name: 'Tego Foamex 805', batches: ['S300062', 'S300063', 'S300064'] }, // 3 партии
  {
    name: 'Tego Foamex 810',
    batches: ['S300065', 'S300066', 'S300067', 'S300068'],
  }, // 4 партии

  // Загустители
  { name: 'Borchigel L 75 N', batches: ['S300069'] }, // 1 партия
  { name: 'Rheolate 288', batches: ['S300070'] }, // 1 партия
  { name: 'Rheolate 644', batches: ['S300071', 'S300072', 'S300073'] }, // 3 партии
  { name: 'Tylose H 10000', batches: ['S300074', 'S300075'] }, // 2 партии
  { name: 'Tylose H 6000', batches: ['S300076'] }, // 1 партия
  { name: 'Acrysol RM-8W', batches: ['S300077', 'S300078'] }, // 2 партии

  // Отвердители
  { name: 'Bayhydur 3100', batches: ['S300079'] }, // 1 партия

  // Биоциды и консерванты
  { name: 'Mergal K10N', batches: ['S300080'] }, // 1 партия
  {
    name: 'Acticide MV',
    batches: ['S300081', 'S300082', 'S300083', 'S300084'],
  }, // 4 партии
  { name: 'Acticide HF', batches: ['S300085', 'S300086', 'S300087'] }, // 3 партии

  // Вода (техническая)
  { name: 'Вода', batches: ['S300088', 'S300089', 'S300090', 'S300091'] }, // 4 партии
];
