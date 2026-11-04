using UnityEngine;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Controls player Animator states (idle, run, death, hit).
    /// </summary>
    public class PlayerAnimation : MonoBehaviour
    {
        [SerializeField] private Animator _animator;
        [SerializeField] private PlayerInputHandler _inputHandler;
        [SerializeField] private PlayerHealth _health;

        private static readonly int SpeedHash = Animator.StringToHash("Speed");
        private static readonly int IsDeadHash = Animator.StringToHash("IsDead");

        private void Awake()
        {
            if (_animator == null) _animator = GetComponentInChildren<Animator>();
            if (_inputHandler == null) _inputHandler = GetComponent<PlayerInputHandler>();
            if (_health == null) _health = GetComponent<PlayerHealth>();
        }

        private void OnEnable()
        {
            if (_health != null)
            {
                _health.OnPlayerDied += HandleDeath;
            }
        }

        private void OnDisable()
        {
            if (_health != null)
            {
                _health.OnPlayerDied -= HandleDeath;
            }
        }

        private void Update()
        {
            if (_animator == null || _inputHandler == null) return;

            float speed = _inputHandler.MoveInput.magnitude;
            _animator.SetFloat(SpeedHash, speed);
        }

        private void HandleDeath()
        {
            if (_animator != null)
            {
                _animator.SetBool(IsDeadHash, true);
            }
        }
    }
}

