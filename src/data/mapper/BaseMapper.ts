export interface BaseMapper<E, D> {
    convert(entity: E): D;
    revert(dto: D): E;
}