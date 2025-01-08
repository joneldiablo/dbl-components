export default function useClasses({ fixedClasses, initialClasses }: {
    fixedClasses: any;
    initialClasses: any;
}): {
    classes: any[];
    setClasses: (classes: any) => any[];
    toggleClasses: (classes: any) => boolean;
    addClasses: (classes: any) => boolean;
    deleteClasses: (classes: any) => boolean;
};
