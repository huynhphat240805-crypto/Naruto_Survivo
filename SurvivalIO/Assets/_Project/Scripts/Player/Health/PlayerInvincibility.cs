using System.Collections;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Grants post-hit invulnerability frames (i-frames) and triggers visual flashing.
    /// </summary>
    public class PlayerInvincibility : MonoBehaviour
    {
        [SerializeField] private float _invincibilityDuration = 0.8f;
        [SerializeField] private SpriteRenderer _spriteRenderer;

        public bool IsInvincible { get; private set; }

        private void Awake()
        {
            if (_spriteRenderer == null)
            {
                _spriteRenderer = GetComponentInChildren<SpriteRenderer>();
            }
        }

        public void TriggerInvincibility()
        {
            if (IsInvincible) return;
            StartCoroutine(InvincibilityRoutine());
        }

        private IEnumerator InvincibilityRoutine()
        {
            IsInvincible = true;
            float elapsed = 0f;
            bool visible = true;

            while (elapsed < _invincibilityDuration)
            {
                elapsed += GameConstants.INVINCIBILITY_FLASH_INTERVAL;
                visible = !visible;
                if (_spriteRenderer != null)
                {
                    Color c = _spriteRenderer.color;
                    c.a = visible ? 1f : 0.3f;
                    _spriteRenderer.color = c;
                }
                yield return new WaitForSeconds(GameConstants.INVINCIBILITY_FLASH_INTERVAL);
            }

            if (_spriteRenderer != null)
            {
                Color c = _spriteRenderer.color;
                c.a = 1f;
                _spriteRenderer.color = c;
            }

            IsInvincible = false;
        }
    }
}

