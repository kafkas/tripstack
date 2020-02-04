import Residency, {
  MultipleCurrentsError,
  ConflictInPeriodsError,
} from '../Residency';
import City from '../City';
import ShortDate from '../ShortDate';
import { city as createCity, date, residency } from './helpers';

test('conflictsWith method', () => {
  expectConflictsBidirectionally(
    residencyGB('1994-11-20', '1999-05-11'),
    residencyGB('1995-05-09', '2001-02-07')
  );
  expectConflictsBidirectionally(
    residencyGB('1994-11-20', '1999-05-11'),
    residencyGB('1999-05-10', '2001-02-07')
  );
  expectConflictsBidirectionally(
    residencyGB('1994-11-20', '1999-05-11'),
    residencyGB('1999-05-11', '2001-02-07')
  );
  expectNotConflictsBidirectionally(
    residencyGB('1994-11-20', '1999-05-11'),
    residencyGB('1999-05-12', '2001-02-07')
  );
  expectConflictsBidirectionally(
    residencyGB('2012-08-06', '2016-05-11'),
    residencyGB('2016-05-11', '2019-08-07')
  );
  expectNotConflictsBidirectionally(
    residencyGB('2012-08-06', '2016-05-11'),
    residencyGB('2016-05-12', '2019-08-07')
  );

  function residencyGB(fromDateString: string, toDateString: string | null) {
    return residency('abc', 'GB-1', fromDateString, toDateString);
  }
});

function expectConflictsBidirectionally(R1: Residency, R2: Residency) {
  expectConflicts(R1, R2);
  expectConflicts(R2, R1);
}

function expectNotConflictsBidirectionally(R1: Residency, R2: Residency) {
  expectNotConflicts(R1, R2);
  expectNotConflicts(R2, R1);
}

function expectConflicts(R1: Residency, R2: Residency) {
  expect(R1.conflictsWith(R2)).toStrictEqual(true);
}

function expectNotConflicts(R1: Residency, R2: Residency) {
  expect(R1.conflictsWith(R2)).toStrictEqual(false);
}

test('validateConsistency static method', () => {
  const residencies = [
    residency('az4', 'AZ-4', '1994-02-22', '2002-02-07'), // +10
    residency('tr9', 'TR-9', '2002-02-17', '2013-02-07'), //  +1
    residency('us605', 'US-605', '2013-02-08', '2013-09-15'), // +1
    residency('gb95', 'GB-95', '2013-09-16', '2020-01-15'), // +4
    residency('us55', 'US-1000', '2020-01-19', null),
  ];

  expectConsistencyCZ(date(20, 4, 1990), date(21, 2, 1994));
  expectPeriodConflictCZ(date(20, 4, 1990), date(22, 2, 1994), 0);
  expectPeriodConflictCZ(date(20, 4, 1990), date(23, 2, 1994), 0);
  expectPeriodConflictCZ(date(25, 9, 2003), date(14, 3, 2004), 1);
  expectPeriodConflictCZ(date(25, 9, 1995), date(18, 2, 2002), 0);
  expectConsistencyCZ(date(8, 2, 2002), date(16, 2, 2002));
  expectPeriodConflictCZ(date(7, 2, 2002), date(18, 2, 2002), 0);
  expectPeriodConflictCZ(date(14, 1, 2020), date(19, 1, 2020), 3);
  expectPeriodConflictCZ(date(15, 1, 2020), date(24, 1, 2020), 3);
  expectCurrentsConflict(date(15, 1, 2020), null, 4);
  expectCurrentsConflict(date(26, 1, 2020), null, 4);

  const czechResidencyProps = {
    id: 'cz14',
    city: createCity('CZ-14'),
  };

  function expectConsistencyCZ(fromDate: ShortDate, toDate: ShortDate | null) {
    return expectConsistency({ ...czechResidencyProps, fromDate, toDate });
  }

  function expectPeriodConflictCZ(
    fromDate: ShortDate,
    toDate: ShortDate | null,
    conflictResidencyIndex: number,
    conflictMessage?: string
  ) {
    return expectInconsistency({
      ...czechResidencyProps,
      fromDate,
      toDate,
      conflictCode: 'ConflictInPeriodsError',
      conflictResidency: residencies[conflictResidencyIndex],
      conflictMessage,
    });
  }

  function expectCurrentsConflict(
    fromDate: ShortDate,
    toDate: ShortDate | null,
    conflictResidencyIndex: number,
    conflictMessage?: string
  ) {
    return expectInconsistency({
      ...czechResidencyProps,
      fromDate,
      toDate,
      conflictCode: 'MultipleCurrentsError',
      conflictResidency: residencies[conflictResidencyIndex],
      conflictMessage,
    });
  }

  // Edits
  expectInconsistentEdit(date(7, 2, 2013), date(16, 9, 2013), 1);
  expectInconsistentEdit(date(8, 2, 2013), date(16, 9, 2013), 3);
  expectInconsistentEdit(date(8, 2, 2013), date(17, 9, 2015), 3);

  function expectInconsistentEdit(
    fromDate: ShortDate,
    toDate: ShortDate | null,
    conflictResidencyIndex: number,
    conflictMessage?: string
  ) {
    return expectInconsistency({
      id: 'us605',
      city: createCity('US-605'),
      fromDate,
      toDate,
      conflictCode: 'ConflictInPeriodsError',
      conflictResidency: residencies[conflictResidencyIndex],
      conflictMessage,
    });
  }

  interface CandidateProps {
    id?: string;
    city: City;
    fromDate: ShortDate;
    toDate: ShortDate | null;
  }

  interface ConflictProps {
    conflictCode?: 'MultipleCurrentsError' | 'ConflictInPeriodsError';
    conflictResidency?: Residency;
    conflictMessage?: string;
  }

  function expectConsistency({ id, city, fromDate, toDate }: CandidateProps) {
    expect(() => {
      Residency.validateConsistency(residencies, {
        id,
        city,
        fromDate,
        toDate,
      });
    }).not.toThrow();
  }

  function expectInconsistency({
    id,
    city,
    fromDate,
    toDate,
    conflictCode,
    conflictResidency,
  }: CandidateProps & ConflictProps) {
    const conflictPeriod = (conflictResidency as Residency).getConflictPeriodWith(
      new Residency(id, city, fromDate, toDate)
    );
    let result: ResidencyConflictError | undefined;
    try {
      Residency.validateConsistency(residencies, {
        id,
        city,
        fromDate,
        toDate,
      });
    } catch (err) {
      result = err;
    }
    if (conflictCode === 'ConflictInPeriodsError') {
      expect(
        result instanceof ConflictInPeriodsError &&
          result.conflictResidency.equals(conflictResidency) &&
          result.conflictPeriod.equals(conflictPeriod)
      ).toBe(true);
    } else if (conflictCode === 'MultipleCurrentsError') {
      expect(
        result instanceof MultipleCurrentsError &&
          result.currentResidency.equals(conflictResidency) &&
          result.conflictPeriod.equals(conflictPeriod)
      ).toBe(true);
    }
  }
});

test('findResidencyAt static method', () => {
  const residencies = [
    residency('az4', 'AZ-4', '1994-02-22', '2002-02-07'), // +10
    residency('tr9', 'TR-9', '2002-02-17', '2013-02-07'), //  0
    residency('us605', 'US-605', '2013-02-07', '2013-09-15'), // +1
    residency('gb95', 'GB-95', '2013-09-16', '2020-01-15'), // +4
    residency('us55', 'US-1000', '2020-01-19', null),
  ];

  expectResidencyAt(date(13, 4, 1992)).toBe(null);
  expectResidencyAt(date(21, 2, 1994)).toBe(null);
  expectResidencyAt(date(22, 2, 1994)).toBe(residencies[0]);
  expectResidencyAt(date(19, 9, 1999)).toBe(residencies[0]);
  expectResidencyAt(date(7, 2, 2002)).toBe(residencies[0]);
  expectResidencyAt(date(8, 2, 2002)).toBe(null);
  expectResidencyAt(date(16, 2, 2002)).toBe(null);
  expectResidencyAt(date(17, 2, 2002)).toBe(residencies[1]);
  expectResidencyAt(date(7, 2, 2013)).toBe(residencies[2]);

  function expectResidencyAt(d: ShortDate) {
    return expect(Residency.findResidencyAt(residencies, d));
  }
});
