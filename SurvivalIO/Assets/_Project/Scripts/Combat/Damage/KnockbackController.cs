using System.Collections;
using UnityEngine;

namespace SurvivalIO.Combat
{
    /// <summary>
    /// Handles physical knockback application using Rigidbody2D.
    /// </summary>
    public class KnockbackController : MonoBehaviour
    {
        [SerializeField] private Rigidbody2D _rigidbody2D;
        [SerializeField] private float _defaultDuration = 0.15f;

        private Coroutine _knockbackRoutine;
        public bool IsBeingKnockedBack { get; private set; }

        private void Awake()
        {
            if (_rigidbody2D == null)
            {
                _rigidbody2D = GetComponent<Rigidbody2D>();
            }
        }

        public void ApplyKnockback(Vector2 direction, float force, float duration = -1f)
        {
            if (_rigidbody2D == null || force <= 0f) return;

            if (_knockbackRoutine != null)
            {
                StopCoroutine(_knockbackRoutine);
            }

            float dur = duration > 0 ? duration : _defaultDuration;
            _knockbackRoutine = StartCoroutine(KnockbackRoutine(direction.normalized * force, dur));
        }

        private IEnumerator KnockbackRoutine(Vector2 velocity, float duration)
        {
            IsBeingKnockedBack = true;
            _rigidbody2D.linearVelocity = velocity;

            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                _rigidbody2D.linearVelocity = Vector2.Lerp(velocity, Vector2.zero, elapsed / duration);
                yield return null;
            }

            _rigidbody2D.linearVelocity = Vector2.zero;
            IsBeingKnockedBack = false;
            _knockbackRoutine = null;
        }
    }
}

