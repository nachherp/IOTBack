-- CreateTable
CREATE TABLE `Miembro` (
    `id_miembro` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `telefono` BIGINT NOT NULL,
    `rol` VARCHAR(50) NOT NULL,
    `carga` INTEGER NOT NULL,
    `edad` INTEGER NOT NULL,
    `id_equipos` INTEGER NOT NULL,

    PRIMARY KEY (`id_miembro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proyecto` (
    `id_proyecto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `estado` VARCHAR(50) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_proyecto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipo` (
    `id_equipo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `id_proyecto` INTEGER NOT NULL,

    PRIMARY KEY (`id_equipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recurso` (
    `id_recurso` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `estado` VARCHAR(50) NOT NULL,
    `id_proyecto` INTEGER NOT NULL,
    `id_miembro` INTEGER NOT NULL,

    PRIMARY KEY (`id_recurso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsoRecurso` (
    `id_uso` INTEGER NOT NULL AUTO_INCREMENT,
    `id_recurso` INTEGER NOT NULL,
    `id_proyecto` INTEGER NOT NULL,
    `descripcion` TEXT NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_uso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrador` (
    `id_admin` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Miembro` ADD CONSTRAINT `Miembro_id_equipos_fkey` FOREIGN KEY (`id_equipos`) REFERENCES `Equipo`(`id_equipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipo` ADD CONSTRAINT `Equipo_id_proyecto_fkey` FOREIGN KEY (`id_proyecto`) REFERENCES `Proyecto`(`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recurso` ADD CONSTRAINT `Recurso_id_proyecto_fkey` FOREIGN KEY (`id_proyecto`) REFERENCES `Proyecto`(`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recurso` ADD CONSTRAINT `Recurso_id_miembro_fkey` FOREIGN KEY (`id_miembro`) REFERENCES `Miembro`(`id_miembro`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsoRecurso` ADD CONSTRAINT `UsoRecurso_id_recurso_fkey` FOREIGN KEY (`id_recurso`) REFERENCES `Recurso`(`id_recurso`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsoRecurso` ADD CONSTRAINT `UsoRecurso_id_proyecto_fkey` FOREIGN KEY (`id_proyecto`) REFERENCES `Proyecto`(`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE;
