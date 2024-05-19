using BeltainsTools;
using BeltainsTools.Utilities;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.AI;

public class Unit_DudeMover : Unit_Dude.DudeUnit
{
    [SerializeField] AnimationCurve m_StandardDashProfileCurve = AnimationCurve.Linear(0, 0, 1, 1);
    [SerializeField] Profile m_ActiveMoverProfile;
    [SerializeField, HideInInspector] NavMeshAgent m_NavAgent;

    public bool IsPacing { get; private set; } = false;
    public bool IsFocussing { get; private set; } = false;
    public float MoveHasteMult { get; private set; } = 1f;

    float DesiredTurnSpeed => m_ActiveMoverProfile.Turn_Speed;
    float DesiredWalkSpeed 
        => Mathf.Clamp((IsPacing ? 
            m_ActiveMoverProfile.Walk_Pacing_Speed : 
            m_ActiveMoverProfile.Walk_Speed) * MoveHasteMult, 
            0, m_ActiveMoverProfile.Walk_Speed_Max);

    MoveData m_QueuedMoveData = new MoveData();

    public class MoveData
    {
        public Vector3 MoveDirection;
        public Vector3? MoveDestination;

        public Vector3 FocusDirection;

        public Dash? DashInfo;

        public struct Dash
        {
            public Vector3 Destination;
            public float Duration;
            public Vector3 Direction;
        }

        public MoveData()
        {
            Reset();
        }

        public void Reset()
        {
            MoveDirection = Vector3.zero;
            MoveDestination = null;

            FocusDirection = Vector3.zero;

            DashInfo = null;
        }
    }


    [System.Serializable]
    public new class Profile : Unit_Dude.DudeUnit.Profile
    {
        public float Walk_Speed;
        public float Walk_Pacing_Speed;
        public float Walk_Speed_Max;
        public float Turn_Speed;

        public float Dash_Delay;
        public float Dash_Distance;
        public float Dash_Duration;


        public static readonly Profile debug = new Profile()
        {
            Walk_Speed = 10f,
            Walk_Pacing_Speed = 5f,
            Walk_Speed_Max = 30f,
            Turn_Speed = 720f,
            Dash_Delay = 0.05f,
            Dash_Distance = 8f,
            Dash_Duration = 0.23f,
        };

        public static readonly Profile debug_Follower = new Profile()
        {
            Walk_Speed = 10f,
            Walk_Pacing_Speed = 5,
            Walk_Speed_Max = 30f,
            Turn_Speed = 480,
            Dash_Delay = 0.05f,
            Dash_Distance = 8,
            Dash_Duration = 0.23f,
        };
    }





    protected override void SetProfile(Unit_Dude.DudeUnit.Profile profile)
    {
        m_ActiveMoverProfile = (Profile)profile;

        m_NavAgent.radius = 0.01f; //Make this agent so thin that it will not register when colliding with other agents //Dude.Size;

        m_NavAgent.speed = DesiredWalkSpeed;
        m_NavAgent.acceleration = m_NavAgent.speed * 20f;
        m_NavAgent.angularSpeed = DesiredTurnSpeed;
    }


    public void ResetPacing() => SetPacing(false);
    /// <summary>Set this dude to move slowly</summary>
    public void SetPacing(bool state)
    {
        IsPacing = state;
        m_NavAgent.speed = DesiredWalkSpeed;
    }

    public void ResetFocussing() => SetFocussing(false);
    /// <summary>Set this dude focusing. If focusing they will turn to face the focus direction</summary>
    public void SetFocussing(bool focussing)
    {
        IsFocussing = focussing;
    }

    /// <summary>Reset haste multiplier to default level</summary>
    public void ResetHaste() => SetHaste(1f);
    /// <summary>Set a multiplier to move speed for this dude's movement</summary>
    public void SetHaste(float moveSpeedMultiplier)
    {
        MoveHasteMult = moveSpeedMultiplier;
        m_NavAgent.speed = DesiredWalkSpeed;
    }



    public void WalkInDirection(Vector3 direction)
    {
        m_QueuedMoveData.MoveDirection = direction.normalized;
    }
    public void WalkTowards(Vector3 worldPosition)
    {
        if (!NavMesh.SamplePosition(worldPosition, out NavMeshHit hit, 1000f, ~0))
            return;

        m_QueuedMoveData.MoveDestination = hit.position;
    }


    /// <summary>Attempt a dash in a direction based on the active mover profile settings. Return the expected dash data.</summary>
    public MoveData.Dash? DashInDirection(Vector3 direction) => DashTo(transform.position + (direction * m_ActiveMoverProfile.Dash_Distance), m_ActiveMoverProfile.Dash_Duration);
    /// <summary>Attempt to dash to a point over a given amount of time. Return the expected dash data.</summary>
    public MoveData.Dash? DashTo(Vector3 worldPosition, float duration)
    {
        float distance = Vector3.Distance(worldPosition, transform.position);
        float speed = distance / duration;

        //Get real dash params when factoring in obstacles
        float realDistance = m_NavAgent.Raycast(worldPosition, out NavMeshHit hit) ? hit.distance : distance;
        Vector3 realDestination = transform.position + (worldPosition - transform.position).normalized * realDistance;
        float realDuration = realDistance / speed;

        if (realDistance.Approximately(0f))
            return null;

        m_QueuedMoveData.DashInfo = new MoveData.Dash() 
        { 
            Destination = realDestination, 
            Duration = realDuration,
            Direction = (realDestination - transform.position).normalized
        };
        return m_QueuedMoveData.DashInfo;
    }

    /// <summary>Set a specific focal point that this dude should look at when focussing See: <seealso cref="SetFocussing(bool)"/> to enable focussing.</summary>
    /// <param name="deadzone">How close the point to turn to can be to this dude before we ignore it</param>
    public void SetFocusPoint(Vector3 worldPosition, float deadzone = 0.5f)
    {
        if(Vector2.Distance(worldPosition.ToVector2XZ(), transform.position.ToVector2XZ()) > deadzone)
            SetFocusDirection(worldPosition - transform.position);
    }
    /// <summary>Set a specific focus direction that this dude should look when focussing. See: <seealso cref="SetFocussing(bool)"/> to enable focussing</summary>
    public void SetFocusDirection(Vector3 direction)
    {
        m_QueuedMoveData.FocusDirection = direction;
    }



    IEnumerator m_MovementUpdater = null;
    IEnumerator UpdateMovementCoroutine()
    {
        while (true)
        {
            //Treat this as the principle movement tree.
            //Each loop around only one coroutine/method can execute!
            if (m_QueuedMoveData.DashInfo != null)
                yield return DoDash(m_QueuedMoveData.DashInfo.Value);
            else
                DoStandardMovement();

            m_QueuedMoveData.Reset();
            yield return null;
        }
    }

    #region Movement Handling Coroutines
    IEnumerator DoDash(MoveData.Dash dashInfo)
    {
        m_NavAgent.ResetPath();
        m_NavAgent.updateRotation = false;

        //Wait for dash delay
        yield return new ExecuteOverTime(m_ActiveMoverProfile.Dash_Delay, t =>
        { //Do while we wait before the dash
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(dashInfo.Direction, Vector3.up), t);
        });

        //Do the dash
        Vector3 startPos = transform.position;
        yield return new ExecuteOverTime(dashInfo.Duration, t =>
        {
            Vector3 desiredPos = Vector3.Lerp(startPos, dashInfo.Destination, m_StandardDashProfileCurve.Evaluate(t));
            Vector3 offsetFromCurrent = desiredPos - transform.position;
            m_NavAgent.Move(offsetFromCurrent);
        });
    }

    void DoStandardMovement() //NB: DON'T USE COROUTINES IF YOU DON't NEED TO WAIT! EVEN YIELD BREAK CAUSES A FRAME OF DELAY!!!
    {
        Vector3 finalLookDirection = Vector3.zero;

        //Handle normal walking
        if (m_QueuedMoveData.MoveDirection != Vector3.zero)
        {
            m_NavAgent.ResetPath(); //Assume we don't want to use destination pathing if we're taking directional input

            m_NavAgent.Move(m_QueuedMoveData.MoveDirection * m_NavAgent.speed * Time.deltaTime);

            //Rotate to look in walking direction. To be overridden by later, more important, calls
            finalLookDirection = m_QueuedMoveData.MoveDirection;
        }
        else if (m_QueuedMoveData.MoveDestination != null)
        {
            m_NavAgent.SetDestination((Vector3)m_QueuedMoveData.MoveDestination);
            m_NavAgent.updateRotation = true;
        }

        //Handle facing toward focus target
        if (IsFocussing)
        {
            m_NavAgent.updateRotation = false;
            finalLookDirection = m_QueuedMoveData.FocusDirection;
        }

        //Handle final turning
        if (finalLookDirection != Vector3.zero)
        {
            d.Assert(!m_NavAgent.updateRotation || !m_NavAgent.hasPath, "The nav mesh agent has control of our rotation when we are trying to set it ourselves! No good!");

            transform.rotation =
                    Quaternion.RotateTowards(
                            transform.rotation,
                            Quaternion.LookRotation(finalLookDirection, Vector3.up),
                            m_NavAgent.angularSpeed * Time.deltaTime
                        );
        }
    }
    #endregion



    void PrePool()
    {
        m_NavAgent = GetComponent<NavMeshAgent>();
    }

    void OnSpawn()
    {
        m_MovementUpdater = UpdateMovementCoroutine();
        StartCoroutine(m_MovementUpdater);
    }

    void OnRecycle()
    {
        StopCoroutine(m_MovementUpdater);
        m_MovementUpdater = null; // for sanity

        m_QueuedMoveData.Reset();
        ResetPacing();
        ResetFocussing();
        ResetHaste();
    }


    [System.Diagnostics.Conditional("UNITY_EDITOR")]
    private void OnDrawGizmosSelected()
    {
        if(m_NavAgent != null && m_NavAgent.hasPath)
        {
            List<Vector3> pathNodes = new List<Vector3>() { transform.position };
            pathNodes.AddRange(m_NavAgent.path.corners);
            pathNodes.Add(m_NavAgent.pathEndPosition);
            BeltainsTools.Editor.Bizmos.DrawLine(pathNodes, Color.red);
        }
    }
}
