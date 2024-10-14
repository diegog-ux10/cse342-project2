class Director {
  constructor(name, birthYear, nationality) {
    this.name = name;
    this.birthYear = birthYear;
    this.nationality = nationality;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static validate(director) {
    const errors = [];

    if (!director.name || typeof director.name !== 'string') {
      errors.push('Name is required and must be a string');
    }

    if (!director.birthYear || typeof director.birthYear !== 'number' || director.birthYear < 1800) {
      errors.push('Birth year is required and must be a number greater than or equal to 1800');
    }

    if (!director.nationality || typeof director.nationality !== 'string') {
      errors.push('Nationality is required and must be a string');
    }

    return errors;
  }
}

module.exports = Director;