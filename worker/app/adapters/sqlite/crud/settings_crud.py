from __future__ import annotations

from typing import Optional, Sequence

from sqlmodel import Session, select

from app.adapters.sqlite.models.settings import FolderMappingORM, UserSettingORM


def get_user_settings(session: Session) -> Optional[UserSettingORM]:
    statement = select(UserSettingORM)
    return session.exec(statement).first()


def update_user_settings(session: Session, **kwargs) -> UserSettingORM:
    settings = get_user_settings(session)
    if settings:
        for key, value in kwargs.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
        session.add(settings)
    else:
        settings = UserSettingORM(**kwargs)
        session.add(settings)
    session.commit()
    session.refresh(settings)
    return settings


def create_folder_mapping(session: Session, category: str, destination_path: str) -> FolderMappingORM:
    mapping = FolderMappingORM(category=category, destination_path=destination_path)
    session.add(mapping)
    session.commit()
    session.refresh(mapping)
    return mapping


def get_folder_mapping(session: Session, category: str) -> Optional[FolderMappingORM]:
    statement = select(FolderMappingORM).where(FolderMappingORM.category == category)
    return session.exec(statement).first()


def get_all_folder_mappings(session: Session) -> Sequence[FolderMappingORM]:
    statement = select(FolderMappingORM)
    return session.exec(statement).all()


def update_folder_mapping(session: Session, category: str, destination_path: str) -> FolderMappingORM:
    mapping = get_folder_mapping(session, category)
    if mapping:
        mapping.destination_path = destination_path
        session.add(mapping)
        session.commit()
        session.refresh(mapping)
    else:
        mapping = create_folder_mapping(session, category, destination_path)
    return mapping
