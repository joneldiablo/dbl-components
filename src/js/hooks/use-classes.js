export default function useClasses({
  fixedClasses,
  initialClasses
}) {
  const [localClassesSet, setLocalClassesSet] = useState(initialClasses);

  const setClasses = (classes) => {
    const localClasses = setLocalClasses && (Array.isArray(setLocalClasses)
      ? setLocalClasses
      : setLocalClasses.split(' '));
    const setLocalClasses = new Set(localClasses);
    if (!classes) return [setLocalClasses, new Set()];
    const setClasses = new Set(
      classes && (Array.isArray(classes)
        ? classes.flatMap(c => c.split(' '))
        : classes.split(' '))
    );
    return [setLocalClasses, setClasses];
  }

  const toggleClasses = (classes) => {
    if (!classes) return false;
    const [localClasses, setClasses] = setClasses(classes);
    setClasses.forEach(c => {
      if (localClasses.has(c)) localClasses.delete(c);
      else localClasses.add(c);
    });
    this.setState({
      localClasses: Array.from(localClasses).flat().join(' ')
    });
    return true;
  }

  const addClasses = (classes) => {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach(localClasses.add.bind(localClasses));
    this.setState({
      localClasses: Array.from(localClasses).flat().join(' ')
    });
    return true;
  }

  const deleteClasses = (classes) => {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach(localClasses.delete.bind(localClasses));
    this.setState({
      localClasses: Array.from(localClasses).flat().join(' ')
    });
    return true;
  }

  const classes = [this.constructor.jsClass, name, this.name, this.classes, localClasses];

  return {
    classes,
    setClasses,
    toggleClasses,
    addClasses,
    deleteClasses,
  }
}