export default function store(name) {
  return (target) => {
    Object.assign(target.prototype, {
      getStoreName() {
        return name;
      },
    });
  };
}
