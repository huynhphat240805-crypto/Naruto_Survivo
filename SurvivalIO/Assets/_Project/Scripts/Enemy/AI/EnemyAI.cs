using UnityEngine;

namespace SurvivalIO.Enemy
{
    public enum EnemyAIState
    {
        Idle,
        Chasing,
        Attacking,
        Stunned
    }

    /// <summary>
    /// Evaluates proximity and state transitions for enemy actions.
    /// </summary>
    public class EnemyAI : MonoBehaviour
    {
        [SerializeField] private EnemyMovement _movement;
        [SerializeField] private float _attackRange = 0.8f;

        private EnemyAIState _currentState = EnemyAIState.Chasing;
        private Transform _target;

        public EnemyAIState CurrentState => _currentState;

        private void Awake()
        {
            if (_movement == null) _movement = GetComponent<EnemyMovement>();
        }

        public void Initialize(Transform target)
        {
            _target = target;
            _movement?.SetTarget(target);
            _currentState = EnemyAIState.Chasing;
        }

        private void Update()
        {
            if (_target == null) return;

            float distSqr = (transform.position - _target.position).sqrMagnitude;
            if (distSqr <= _attackRange * _attackRange)
            {
                _currentState = EnemyAIState.Attacking;
            }
            else
            {
                _currentState = EnemyAIState.Chasing;
            }
        }
    }
}

