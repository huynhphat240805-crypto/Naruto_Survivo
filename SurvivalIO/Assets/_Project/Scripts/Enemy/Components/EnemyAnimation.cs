using UnityEngine;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Controls enemy Animator states (running, death, hit flash).
    /// </summary>
    public class EnemyAnimation : MonoBehaviour
    {
        [SerializeField] private Animator _animator;
        [SerializeField] private EnemyHealth _health;

        private static readonly int HitHash = Animator.StringToHash("Hit");
        private static readonly int DeadHash = Animator.StringToHash("IsDead");

        private void Awake()
        {
            if (_animator == null) _animator = GetComponentInChildren<Animator>();
            if (_health == null) _health = GetComponent<EnemyHealth>();
        }

        private void OnEnable()
        {
            if (_health != null)
            {
                _health.OnDamageReceived += HandleHit;
                _health.OnDeath += HandleDeath;
            }
        }

        private void OnDisable()
        {
            if (_health != null)
            {
                _health.OnDamageReceived -= HandleHit;
                _health.OnDeath -= HandleDeath;
            }
        }

        private void HandleHit(float damage, bool isCrit)
        {
            if (_animator != null) _animator.SetTrigger(HitHash);
        }

        private void HandleDeath()
        {
            if (_animator != null) _animator.SetBool(DeadHash, true);
        }
    }
}

