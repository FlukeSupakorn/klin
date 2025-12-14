"""Core layer: domain entities, ports (interfaces), and configuration.

This package contains:
- domain/     Pure domain entities (no dependencies on adapters)
- ports/      Abstract interfaces (protocols) for adapters to implement
- config.py   Application settings
- container.py  Dependency injection container
- lifecycle.py  Startup/shutdown hooks
- logging.py   Logging configuration
"""

from app.core.domain import FileRecord, OrganizeHistory, FolderMapping, UserSetting
from app.core.container import container, get_file_repo, get_history_repo, get_settings_repo, get_vector_index

__all__ = [
    # Domain entities
    "FileRecord",
    "OrganizeHistory", 
    "FolderMapping",
    "UserSetting",
    # Container
    "container",
    "get_file_repo",
    "get_history_repo",
    "get_settings_repo",
    "get_vector_index",
]
