import logging
import sys

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    logger.addHandler(handler)


def log_audit_event(
    action: str,
    entity: str,
    entity_id: int,
    username: str | None = None,
) -> None:
    try:
        logger.info(
            f"[AUDIT]\naction={action}\nentity={entity}\nentity_id={entity_id}\nuser={username or 'unknown'}"
        )
    except Exception as e:
        logger.error(
            f"Failed to write audit log for {action} on {entity} {entity_id}: {e}"
        )
